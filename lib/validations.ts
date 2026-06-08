import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long').optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const CollegeQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  state: z.string().optional(),
  city: z.string().optional(),
  type: z.enum(['GOVERNMENT', 'PRIVATE', 'DEEMED']).optional(),
  degree: z.string().optional(),
  minFees: z.coerce.number().nonnegative().optional(),
  maxFees: z.coerce.number().nonnegative().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
});

export const ReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  pros: z.string().optional(),
  cons: z.string().optional(),
  authorName: z.string().min(2, 'Author name must be at least 2 characters'),
  batch: z.string().min(4, 'Batch info is required'),
  course: z.string().min(2, 'Course name is required'),
  collegeId: z.string(),
});

export const CompareQuerySchema = z.object({
  collegeIds: z.array(z.string()).min(2, 'Provide at least 2 colleges to compare').max(3, 'Compare at most 3 colleges'),
});

export const SavedCollegeSchema = z.object({
  collegeId: z.string(),
});
