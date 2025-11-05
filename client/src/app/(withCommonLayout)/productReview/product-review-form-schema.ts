import { z } from "zod";

export const productReviewSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Name is required"),
  image: z.string().optional(),
  district: z.string().optional(),
  comment: z.string().min(1, "Comment is required"),
  status: z.boolean(),
});

export type ProductReview = z.infer<typeof productReviewSchema>;
