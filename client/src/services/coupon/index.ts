"use server";

import { apiBaseUrl } from "@/config/config";

export const getSingleCoupon = async (couponId: { couponId: string }) => {
  const res = await fetch(`${apiBaseUrl}/coupon/${couponId}`);
  return res.json();
};
