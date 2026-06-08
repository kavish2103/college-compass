import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ReviewSchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/utils';

export const dynamic = 'force-dynamic';

// GET /api/colleges/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: {
          orderBy: { totalFees: 'asc' },
        },
        placements: {
          orderBy: { year: 'desc' },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!college) {
      return errorResponse('College not found', 404);
    }

    return successResponse(college);
  } catch (error: unknown) {
    console.error('Error fetching college details:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch college details';
    return errorResponse(message, 500);
  }
}

// POST /api/colleges/[id] (Create a new review for the college)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: collegeId } = params;
    const body = await req.json();

    // Validate body
    const validation = ReviewSchema.safeParse({ ...body, collegeId });
    if (!validation.success) {
      return errorResponse(validation.error.issues[0].message, 400);
    }

    const { rating, title, content, pros, cons, authorName, batch, course } = validation.data;

    // Check if college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return errorResponse('College not found', 404);
    }

    // Get current user session if logged in
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as { id: string }).id : null;

    // Create review
    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          rating,
          title,
          content,
          pros,
          cons,
          authorName,
          batch,
          course,
          collegeId,
          userId,
          isVerified: !!userId, // verified review if logged in
        },
      });

      // Recalculate average rating and total reviews for the college
      const reviews = await tx.review.findMany({
        where: { collegeId },
        select: { rating: true },
      });

      const totalReviews = reviews.length;
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const overallRating = Number((totalRating / totalReviews).toFixed(1));

      await tx.college.update({
        where: { id: collegeId },
        data: {
          overallRating,
          totalReviews,
        },
      });

      return newReview;
    });

    return successResponse(review, null, 201);
  } catch (error: unknown) {
    console.error('Error creating review:', error);
    const message = error instanceof Error ? error.message : 'Failed to create review';
    return errorResponse(message, 500);
  }
}
