import { z } from "zod";

export const bannerFormSchema = z.object({
  type: z.string().min(1),
  link: z.string().optional(),
  // image: z
  //   .array(
  //     z.instanceof(File).refine((file) => file.size < 8 * 1024 * 1024, {
  //       message: "File size must be less than 8 MB",
  //     })
  //   )
  //   .max(1, {
  //     message: "Maximum 1 files are allowed",
  //   })
    // .optional()
    // .default([]),
  image: z
      .array(
        z
          .instanceof(File)
          .refine((file) => file.size < 8 * 1024 * 1024, {
            message: "Image size must be less than 8 MB",
          })
      )
      .max(1, { message: "Only 1 image is allowed" })
      // [isUpdate ? "optional" : "min"](1, { message: "Image is required" }),
});

// export const dropZoneConfig = {
//   accept: {
//     "image/*": [".jpg", ".jpeg", ".png", "webp"],
//   },
//   maxFiles: 1,
//   maxSize: 1024 * 1024 * 8,
//   multiple: false,
// };
