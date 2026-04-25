import { useQuery } from '@tanstack/react-query';
import { reviewApi } from '../../api/reviewApi';
import { StarRating } from './StarRating';
import { Review } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface ReviewListProps {
  targetType: 'shop' | 'product';
  targetId: string;
}

export function ReviewList({ targetType, targetId }: ReviewListProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['reviews', targetType, targetId],
    queryFn: async () => {
      const response = await reviewApi.getReviews(targetType, targetId);
      return response.data.data;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.map((review: Review) => (
        <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-medium text-gray-900">{review.userId.name}</p>
              <StarRating rating={review.rating} size="sm" />
            </div>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </p>
          </div>
          {review.comment && (
            <p className="text-gray-700 mt-2">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
