"use server";

import {
  createBrand,
  deleteBrand,
  getBrandById,
  updateBrand,
} from "@/services/brand";
import { TBrand } from "@/types/shared";
import { revalidatePath } from "next/cache";

export async function createFormAction(data: FormData) {
  try {
    await createBrand(data);

    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateFormAction(id: string, data: any) {
  try {
    await updateBrand(id, data);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteBrandAction(id: string) {
  const brand = await getBrandById(id);

  try {
    await deleteBrand(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
