import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { reviewApi } from '../../api/reviewApi';
import { StarRating } from './StarRating';
import { Button } from './Button';

interface ReviewFormProps {
  targetType: 'shop' | 'product';
  targetId: string;
  orderId: string;
  existingReview?: {
    _id: string;
    rating: number;
    comment?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ReviewForm({
  targetType,
  targetId,
  orderId,
  existingReview,
  onSuccess,
  onCancel
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: () =>
      reviewApi.createReview({
        targetType,
        targetId,
        orderId,
        rating,
        comment
      }),
    onSuccess: () => {
      toast.success('Review submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['reviews', targetType, targetId] });
      queryClient.invalidateQueries({ queryKey: [targetType === 'shop' ? 'shops' : 'products'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      reviewApi.updateReview(existingReview!._id, { rating, comment }),
    onSuccess: () => {
      toast.success('Review updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['reviews', targetType, targetId] });
      queryClient.invalidateQueries({ queryKey: [targetType === 'shop' ? 'shops' : 'products'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update review');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (existingReview) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating
        </label>
        <StarRating
          rating={rating}
          interactive
          onRatingChange={setRating}
          size="lg"
        />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review (Optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder="Share your experience..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <p className="mt-1 text-sm text-gray-500">
          {comment.length}/500 characters
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={rating === 0}
          className="flex-1"
        >
          {existingReview ? 'Update Review' : 'Submit Review'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
