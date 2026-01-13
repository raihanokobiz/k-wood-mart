"use server";

import {
  createChildCategory,
  deleteChildCategory,
  updateChildCategory,
} from "@/services/child-category";
import { revalidatePath } from "next/cache";

export async function createFormAction(data: FormData) {
  try {
    console.log("✅ Sending FormData to backend...", data);
    await createChildCategory(data);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateFormAction(id: string, data: FormData) {
  try {
    console.log("✅ Updating childCategory with data:", data);
    await updateChildCategory(id, data);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteChildCategoryAction(id: string) {
  // const childCategory = await getChildCategoryById(id);

  try {
    await deleteChildCategory(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
