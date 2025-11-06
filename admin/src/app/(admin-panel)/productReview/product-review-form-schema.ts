import { z } from "zod";

export const productReviewSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "Name is required"),
  youtubeUrl: z.string().optional(),
  district: z.string().optional(),
  status: z.boolean(),
});

export type ProductReview = z.infer<typeof productReviewSchema>;
