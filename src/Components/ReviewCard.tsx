interface ReviewCardProps {
  courseName: string;
  reviewText: string;
  authorName: string;
  date: string;
  rating?: number;
}

export default function ReviewCard({ courseName, reviewText, authorName, date, rating = 5 }: ReviewCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Rating Stars */}
      <div className="flex gap-1 mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i} className="text-yellow-400 text-lg">
            ★
          </span>
        ))}
      </div>

      {/* Course Name */}
      <h4 className="font-semibold text-gray-900 mb-2">{courseName}</h4>

      {/* Review Text */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{reviewText}</p>

      {/* Author Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
          {authorName.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{authorName}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
    </div>
  )
}