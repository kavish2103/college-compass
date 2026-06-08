import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/utils';
import { SavedCollegeSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

// GET /api/user/saved - Get all saved colleges for the logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse('Unauthorized. Please log in.', 401);
    }

    const userId = (session.user as { id: string }).id;

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId },
      include: {
        college: {
          include: {
            courses: {
              select: {
                degree: true,
                totalFees: true,
              },
            },
            placements: {
              orderBy: { year: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { savedAt: 'desc' },
    });

    return successResponse(savedColleges);
  } catch (error: unknown) {
    console.error('Error fetching saved colleges:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch saved colleges';
    return errorResponse(message, 500);
  }
}

// POST /api/user/saved - Toggle save/unsave college
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return errorResponse('Unauthorized. Please log in.', 401);
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();

    // Validate request body
    const validation = SavedCollegeSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(validation.error.issues[0].message, 400);
    }

    const { collegeId } = validation.data;

    // Check if college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return errorResponse('College not found', 404);
    }

    // Check if already saved
    const existingSave = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId,
          collegeId,
        },
      },
    });

    if (existingSave) {
      // Unsave college
      await prisma.savedCollege.delete({
        where: {
          userId_collegeId: {
            userId,
            collegeId,
          },
        },
      });
      return successResponse({ saved: false }, 'College removed from saved list');
    } else {
      // Save college
      const newSave = await prisma.savedCollege.create({
        data: {
          userId,
          collegeId,
        },
      });
      return successResponse({ saved: true, record: newSave }, 'College saved successfully', 201);
    }
  } catch (error: unknown) {
    console.error('Error toggling saved college:', error);
    const message = error instanceof Error ? error.message : 'Failed to toggle saved college';
    return errorResponse(message, 500);
  }
}
