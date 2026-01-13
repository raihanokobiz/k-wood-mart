"use server";

import {
  createBlog,
  deleteBlog,
  getBlogById,
  updateBlog,
} from "@/services/blogs";
import { revalidatePath } from "next/cache";

export async function createFormAction(data: FormData) {
  try {
    await createBlog(data);

    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateFormAction(id: string, data: any) {
  try {
    await updateBlog(id, data);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// export async function deleteBlogAction(id: string) {
//   const blog = await getBlogById(id);

//   try {
//     await deleteBlog(id);
//     revalidatePath("/");
//     return true;
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// }

export async function deleteBlogAction(id: string): Promise<boolean> {
  try {
    const blog = await getBlogById(id);
    if (!blog) {
      throw new Error("Blog not found");
    }

    await deleteBlog(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    console.error("Failed to delete blog:", error);
    throw new Error(error?.message || "Failed to delete blog");
  }
}
