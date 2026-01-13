import { z } from "zod";

export const campaignFormSchema = z.object({
  name: z.string().min(1),
  couponRef: z.string().nonempty("Coupon is required"),
});

export const dropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", "webp"],
  },
  maxFiles: 1,
  maxSize: 1024 * 1024 * 8,
  multiple: false,
};
