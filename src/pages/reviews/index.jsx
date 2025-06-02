import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReviews } from "@/hooks/useReviews";
import { useState } from "react";

export default function ReviewsTable() {
  const { reviews, deleteReview, isLoading } = useReviews();
  const [expandedId, setExpandedId] = useState(null);

  if (isLoading) return <p>Loading reviews...</p>;

  return (
    <div>
      <h2 className="m-6 mb-12 text-xl font-semibold">Boshqaruv Paneli</h2>
      <Table>
        <TableCaption>Yaqinda yozilgan sharhlaringiz.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Ism</TableHead>
            <TableHead>Sharh</TableHead>
            <TableHead>Harakatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.review_id}>
              <TableCell>{review.review_id}</TableCell>
              <TableCell>{review.name || "Ism mavjud emas"}</TableCell>
              <TableCell>
                <div
                  className={`${
                    expandedId === review.review_id
                      ? ""
                      : "line-clamp-1 overflow-hidden w-[250px]"
                  }`}
                  onClick={() =>
                    setExpandedId(
                      expandedId === review.review_id ? null : review.review_id
                    )
                  }
                >
                  {review.comment}
                </div>
                {expandedId === review.review_id && (
                  <button
                    onClick={() => setExpandedId(null)}
                    className="text-blue-600 text-sm mt-1"
                  >
                    Yashirish
                  </button>
                )}
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => deleteReview(review.review_id)}
                  variant="outline"
                  className="bg-transparent"
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
