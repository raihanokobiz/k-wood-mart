"use server";

import { BASE_URL } from "@/config/config";
import {
  AllCouponResponse,
  AllCouponWithPaginationResponse,
  SingleCouponResponse,
  TCoupon,
} from "@/types/shared";


export async function getOrderReportsByDuration({duration}: { duration: string }): Promise<AllCouponResponse> {
  console.log("duration 0---------------------0-------------------------------0--------------------------", duration);
  const response = await fetch(`${BASE_URL}/report/order?duration=${duration}`, );
  // /report/order?duration=this-day
  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
}

