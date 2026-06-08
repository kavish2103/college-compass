import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/utils';
import { CompareQuerySchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const collegeIdsParam = url.searchParams.get('collegeIds');

    if (!collegeIdsParam) {
      return errorResponse('Missing collegeIds parameter', 400);
    }

    const collegeIds = collegeIdsParam.split(',').filter(Boolean);

    // Validate using Zod schema
    const validation = CompareQuerySchema.safeParse({ collegeIds });
    if (!validation.success) {
      return errorResponse(validation.error.issues[0].message, 400);
    }

    // Fetch details of all requested colleges
    const colleges = await prisma.college.findMany({
      where: {
        id: { in: collegeIds },
      },
      include: {
        courses: {
          orderBy: { totalFees: 'asc' },
        },
        placements: {
          orderBy: { year: 'desc' },
        },
      },
    });

    // Save to comparison history if user is authenticated
    const session = await getServerSession(authOptions);
    if (session?.user && colleges.length > 0) {
      const userId = (session.user as { id: string }).id;
      try {
        await prisma.comparisonHistory.create({
          data: {
            userId,
            collegeIds: colleges.map((c) => c.id),
          },
        });
      } catch (historyErr) {
        console.error('Error logging comparison history:', historyErr);
        // Non-blocking, continue execution
      }
    }

    return successResponse(colleges);
  } catch (error: unknown) {
    console.error('Comparison API error:', error);
    const message = error instanceof Error ? error.message : 'Failed to compare colleges';
    return errorResponse(message, 500);
  }
}
