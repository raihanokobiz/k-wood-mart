"use server";

import {
  createSubCategory,
  deleteSubCategory,
  updateSubCategory,
} from "@/services/sub-category";
import { revalidatePath } from "next/cache";

export async function createFormAction(data: FormData) {
  try {
    console.log("✅ Sending FormData to backend...", data);
    await createSubCategory(data);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateFormAction(id: string, data: FormData) {
  try {
    console.log("✅ Updating subCategory with data:", data);
    await updateSubCategory(id, data);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteSubCategoryAction(id: string) {
  // const subCategory = await getSubCategoryById(id);

  try {
    await deleteSubCategory(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
