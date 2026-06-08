import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { CollegeQuerySchema } from '@/lib/validations';
import { successResponse, errorResponse } from '@/lib/utils';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    // Validate parameters
    const validation = CollegeQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return errorResponse(validation.error.issues[0].message, 400);
    }

    const {
      search,
      page,
      limit,
      state,
      city,
      type,
      degree,
      minFees,
      maxFees,
      minRating,
    } = validation.data;

    const skip = (page - 1) * limit;

    // Build Prisma query clauses
    const where: Prisma.CollegeWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (state) {
      where.state = { equals: state, mode: 'insensitive' };
    }

    if (city) {
      where.city = { equals: city, mode: 'insensitive' };
    }

    if (type) {
      where.type = type;
    }

    if (minRating) {
      where.overallRating = { gte: minRating };
    }

    // Courses/Fees filters
    const courseWhere: Prisma.CourseWhereInput = {};

    if (degree) {
      courseWhere.degree = { equals: degree, mode: 'insensitive' };
    }

    if (minFees !== undefined || maxFees !== undefined) {
      courseWhere.totalFees = {};
      if (minFees !== undefined) courseWhere.totalFees.gte = minFees;
      if (maxFees !== undefined) courseWhere.totalFees.lte = maxFees;
    }

    if (Object.keys(courseWhere).length > 0) {
      where.courses = {
        some: courseWhere,
      };
    }

    // Perform queries
    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip,
        take: limit,
        orderBy: { overallRating: 'desc' },
        include: {
          courses: {
            select: {
              name: true,
              degree: true,
              totalFees: true,
              annualFees: true,
            },
          },
          placements: {
            orderBy: { year: 'desc' },
            take: 1, // Only get the latest placement info for list cards
          },
        },
      }),
      prisma.college.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return successResponse(colleges, {
      page,
      limit,
      total,
      totalPages,
    });
  } catch (error: unknown) {
    console.error('Error fetching colleges:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch colleges';
    return errorResponse(message, 500);
  }
}
