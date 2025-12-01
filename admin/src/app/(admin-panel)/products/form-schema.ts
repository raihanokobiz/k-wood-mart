import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  brandRef: z.string().nonempty("Brand is required"),
  discountType: z.string().optional(),
  discount: z.string().optional(),
  // mrpPrice: z.string().min(1, "MRP is required"),
  // status: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  quantity: z.string().optional(),
  freeShipping: z.string().optional(),
  categoryRef: z.string().nonempty("Category is required"),
  subCategoryRef: z.string().optional(),
  childCategoryRef: z.string().optional(),
  inventoryType: z.string().nonempty("Inventory Type is required"),
  // inventoryArray: z.array(z.object(z.string())).optional(),
  inventories: z.array(
    z.object({
      id: z.string().optional().default(""),
      color: z.string().optional(),
      colorName: z.string().optional(),
      size: z.string().optional(),
      // quantity: z.string().nonempty("Quantity is required"),
      mrpPrice: z.string().nonempty("Price is required"),
    })
  ),

  images: z
    .array(
      // z.instanceof(File).refine((file) => file.size < 8 * 1024 * 1024, {
      //   message: "File size must be less than 8 MB",
      // })
      z.any()
    )
    // .max(1, {
    //   message: "Maximum 1 files are allowed",
    // })
    .optional()
    .default([]),
  thumbnailImage: z
    .array(
      z.instanceof(File).refine((file) => file.size < 8 * 1024 * 1024, {
        message: "File size must be less than 8 MB",
      })
    )
    .min(1, {
      message: "Minimum 1 files are allowed",
    }),
  // .optional()
  // .default([]),
  backViewImage: z
    .array(
      z.instanceof(File).refine((file) => file.size < 8 * 1024 * 1024, {
        message: "File size must be less than 8 MB",
      })
    )
    // .max(1, {
    //   message: "Maximum 1 files are allowed",
    // })
    .optional()
    .default([]),
  sizeChartImage: z
    .array(
      z.instanceof(File).refine((file) => file.size < 8 * 1024 * 1024, {
        message: "File size must be less than 8 MB",
      })
    )
    // .max(1, {
    //   message: "Maximum 1 files are allowed",
    // })
    .optional()
    .default([]),
  featured: z.boolean().optional(),
  videoUrl: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || /^https?:\/\/.+/.test(val), {
      message: "Enter a valid URL",
    }),
  // new fields
  material: z.string().optional(),
  fabrics: z
    .array(
      z.object({
        colorCode: z.string().optional(),
        colorName: z.string().optional(),
        images: z.array(z.any()).optional().default([]),
      })
    )
    .optional()
    .default([]),
  colors: z
    .array(
      z.object({
        colorName: z.string().optional(),
        images: z.array(z.any()).optional().default([]),
      })
    )
    .optional()
    .default([]),
  sizes: z
    .array(
      z.object({
        sizeName: z.string().optional(),
        images: z.array(z.any()).optional().default([]),
      })
    )
    .optional()
    .default([]),
  set: z
    .array(
      z.object({
        setName: z.string().optional(),
        images: z.array(z.any()).optional().default([]),
      })
    )
    .optional()
    .default([]),
});

export const dropZoneConfig = {
  accept: {
    "image/*": [".jpg", ".jpeg", ".png", "webp"],
  },
  maxFiles: 1,
  maxSize: 1024 * 1024 * 8,
  multiple: false,
};
