'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ReviewSchema } from '@/lib/validations';

interface ReviewFormProps {
  collegeId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ collegeId, onSuccess }: ReviewFormProps) {
  const { data: session } = useSession();

  // Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [batch, setBatch] = useState('');
  const [course, setCourse] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const formData = {
      rating,
      title,
      content,
      pros: pros || undefined,
      cons: cons || undefined,
      authorName: authorName || (session?.user?.name ? (session.user.name as string) : ''),
      batch,
      course,
      collegeId,
    };

    // Client-side validation
    const validation = ReviewSchema.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/colleges/${collegeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit review');
      }

      setSuccess(true);
      // Reset form
      setTitle('');
      setContent('');
      setPros('');
      setCons('');
      setAuthorName('');
      setBatch('');
      setCourse('');
      setRating(5);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      console.error('Review submit error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Write a Review</h3>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700">
          🎉 Thank you! Your review has been submitted successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars Selection */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
            Rating
          </span>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-2xl outline-none"
              >
                <span className={star <= rating ? 'text-amber-400' : 'text-gray-200'}>
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="course-input" className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
              Course / Branch
            </label>
            <input
              id="course-input"
              type="text"
              placeholder="e.g. B.Tech Computer Science"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="batch-input" className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
              Batch Year
            </label>
            <input
              id="batch-input"
              type="text"
              placeholder="e.g. 2020-2024"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="author-input" className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
              Your Name
            </label>
            <input
              id="author-input"
              type="text"
              placeholder={session?.user?.name ? `${session.user.name}` : 'e.g. Rahul Verma'}
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="title-input" className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
              Review Title
            </label>
            <input
              id="title-input"
              type="text"
              placeholder="e.g. Exceptional academics and placement rate"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        {/* Detailed content */}
        <div>
          <label htmlFor="content-input" className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
            Detailed Review
          </label>
          <textarea
            id="content-input"
            rows={3}
            placeholder="Share your overall experience in detail (minimum 10 characters)..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
            required
          />
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pros-input" className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
              Pros (Optional)
            </label>
            <textarea
              id="pros-input"
              rows={2}
              placeholder="What did you love about this college?"
              value={pros}
              onChange={(e) => setPros(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
            />
          </div>
          <div>
            <label htmlFor="cons-input" className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
              Cons (Optional)
            </label>
            <textarea
              id="cons-input"
              rows={2}
              placeholder="What could be improved?"
              value={cons}
              onChange={(e) => setCons(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {loading ? 'Submitting Review...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
