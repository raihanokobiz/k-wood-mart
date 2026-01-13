"use server";

import {
  createBanner,
  deleteBanner,
  getBannerById,
  updateBanner,
} from "@/services/banner";
import { TBanner } from "@/types/shared";
import { revalidatePath } from "next/cache";

export async function createFormAction(data: FormData) {
  try {
    await createBanner(data);

    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateFormAction(id: string, data: any) {
  try {
    await updateBanner(id, data);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteBannerAction(id: string) {
  const banner = await getBannerById(id);

  try {
    await deleteBanner(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
