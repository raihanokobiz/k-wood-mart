import { z } from "zod";

export const couponFormSchema = z.object({
  code: z.string().min(1),
  discount: z.string().min(1),
  useLimit: z.string().optional(),
  startDate: z.date().optional(),
  expireDate: z.date().optional(),
  discountType: z.string().min(1),
  categoryRef: z.string().optional(),
  brandRef: z.string().optional(),
  subCategoryRef: z.string().optional(),
});
