import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/utils';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const QuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(5),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: collegeId } = params;

    // Parse query parameters
    const url = new URL(req.url);
    const pageParam = url.searchParams.get('page');
    const limitParam = url.searchParams.get('limit');

    const validation = QuerySchema.safeParse({
      page: pageParam ? parseInt(pageParam) : undefined,
      limit: limitParam ? parseInt(limitParam) : undefined,
    });

    if (!validation.success) {
      return errorResponse(validation.error.issues[0].message, 400);
    }

    const { page, limit } = validation.data;
    const skip = (page - 1) * limit;

    // Check if college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return errorResponse('College not found', 404);
    }

    // Fetch reviews and total count
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { collegeId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({
        where: { collegeId },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(reviews, {
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error: unknown) {
    console.error('Error fetching reviews:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch reviews';
    return errorResponse(message, 500);
  }
}
