import { z } from "zod";

export const emiFormSchema = z.object({
  isActive: z.boolean().default(true),
  plans: z
    .array(
      z.object({
        months: z.coerce
          .number()
          .min(1, "Months must be at least 1")
          .max(60, "Months must be at most 60"),
        interestRate: z.coerce
          .number()
          .min(0, "Interest rate cannot be negative")
          .max(100, "Interest rate cannot exceed 100"),
      })
    )
    .min(1, "At least one EMI plan is required"),
});

export const defaultEmiValues = {
  isActive: true,
  plans: [{ months: 0, interestRate: 0 }],
};
