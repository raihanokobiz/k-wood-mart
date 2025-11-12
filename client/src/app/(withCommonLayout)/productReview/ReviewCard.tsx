import { YouTubeModal } from "@/utilits/YouTubeModal ";

interface Review {
  _id: string;
  name: string;
  district: string;
  youtubeUrl: string;
}

interface ReviewsCardProps {
  review: Review;
}

export default function ReviewsCard({ review } : ReviewsCardProps) {


  return (
    <>
      <div
        key={review._id}
        className="bg-white rounded-lg shadow-md  hover:shadow-lg transition"
      >
        <div className=" w-full h-auto relative">
          <YouTubeModal url={review.youtubeUrl} />
        </div>
        <div className="flex justify-between p-4">
          <h3 className="font-semibold text-lg mb-1">
            {review.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            {review.district}
          </p>
        </div>
      </div>
    </>
  );
}
