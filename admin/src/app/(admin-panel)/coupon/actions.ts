"use server";

import {
  createCoupon,
  deleteCoupon,
  getCouponById,
  updateCoupon,
} from "@/services/coupon";
import { TCoupon } from "@/types/shared";
import { revalidatePath } from "next/cache";

export async function createFormAction(data: FormData) {
  try {
    console.log(data);
    await createCoupon(data);

    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateFormAction(id: string, data: any) {
  try {
    console.log(data, "update data from action....");
    await updateCoupon(id, data);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteCouponAction(id: string) {
  const coupon = await getCouponById(id);
  console.log(coupon, "coupon to delete...");

  try {
    await deleteCoupon(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
