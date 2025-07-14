import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { useForm } from "@/hooks/useForm";
import { z } from "zod";
import { addServiceReview } from "@/services/petService.service";

interface ServiceReviewDialogProps {
  serviceId: string;
  serviceName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted?: () => void;
}

const reviewSchema = z.object({
  rating: z.number().min(1, "Chọn số sao"),
  comment: z.string().min(5, "Nhận xét tối thiểu 5 ký tự"),
});

type ReviewForm = z.infer<typeof reviewSchema>;

export const ServiceReviewDialog: React.FC<ServiceReviewDialogProps> = ({
  serviceId,
  serviceName,
  open,
  onOpenChange,
  onSubmitted,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    reset,
  } = useForm<ReviewForm>({
    initialValues: { rating: 5, comment: "" },
    validationSchema: reviewSchema,
    onSubmit: async (data) => {
      setSubmitting(true);
      setError(null);
      try {
        await addServiceReview(serviceId, data);
        onOpenChange(false);
        reset();
        onSubmitted?.();
      } catch (e: any) {
        setError(e.message || "Gửi đánh giá thất bại");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Star rating UI
  const renderStars = () => (
    <div className="flex gap-1 mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => handleChange("rating", star)}
          className={star <= values.rating ? "text-yellow-400" : "text-gray-300"}
          aria-label={`Chọn ${star} sao`}
        >
          <Star className="w-7 h-7 fill-current" />
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đánh giá dịch vụ</DialogTitle>
        </DialogHeader>
        <div className="mb-2 font-medium">{serviceName}</div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
          autoComplete="off"
        >
          <label className="font-medium">Chọn số sao</label>
          {renderStars()}
          {errors.rating && (
            <div className="text-red-500 text-xs">{errors.rating}</div>
          )}
          <label htmlFor="comment" className="font-medium">
            Nhận xét
          </label>
          <Input
            id="comment"
            value={values.comment}
            onChange={(e) => handleChange("comment", e.target.value)}
            placeholder="Nhận xét của bạn về dịch vụ..."
            disabled={submitting}
            maxLength={500}
          />
          {errors.comment && (
            <div className="text-red-500 text-xs">{errors.comment}</div>
          )}
          {error && <div className="text-red-500 text-xs">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={submitting}>
                Hủy
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 