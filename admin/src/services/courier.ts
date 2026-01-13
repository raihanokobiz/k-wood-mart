"use server";

import {
  STEADFAST_API_KEY,
  STEADFAST_BASE_URL,
  STEADFAST_SECRET_KEY,
} from "@/config/config";
import { SteadfastOrderPayload } from "@/types/shared";

export async function createSteadfastOrder(data: SteadfastOrderPayload) {
  try {
    const response = await fetch(`${STEADFAST_BASE_URL}/create_order`, {
      headers: {
        "Content-Type": "application/json",
        "Api-Key": STEADFAST_API_KEY || "",
        "Secret-Key": STEADFAST_SECRET_KEY || "",
      },
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.json();
  } catch (error: any) {
    console.log(error.message);
  }
}
