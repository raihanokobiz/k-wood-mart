import { z } from "zod";

// export const blogFormSchema = z.object({
//   title: z.string().min(1),
//   details: z.string().optional(),
//   author: z.string().optional(),
//   tags: z.array(z.string()).min(1, "Please add at least one tag"),
//   image: z
//     .array(
//       z.instanceof(File).refine((file) => file.size < 8 * 1024 * 1024, {
//         message: "File size must be less than 8 MB",
//       })
//     )
//     .max(1, {
//       message: "Maximum 1 files are allowed",
//     })
//     .optional()
//     .default([]),
// });

export const getBlogFormSchema = (isUpdate = false) =>
  z.object({
    title: z.string().min(1),
    details: z.string().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).min(1, "Please add at least one tag"),
    image: z
      .array(
        z.instanceof(File).refine((file) => file.size < 8 * 1024 * 1024, {
          message: "File size must be less than 8 MB",
        })
      )
      .max(1, { message: "Maximum 1 file is allowed" })
      [isUpdate ? "optional" : "min"](1, { message: "Image is required" }),
  });


export const dropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", "webp"],
  },
  maxFiles: 1,
  maxSize: 1024 * 1024 * 8,
  multiple: false,
};
