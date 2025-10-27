"use server";

import { createSteadfastOrder } from "@/services/courier";
import { updateOrderStatus } from "@/services/order";
import { SteadfastOrderPayload } from "@/types/shared";
import { revalidatePath } from "next/cache";

export async function UpdateOrderStatus(orderId: string, status: string) {
  try {
    const statusEntry = { status: status };
    const res = await updateOrderStatus(String(orderId), statusEntry);
    console.log(res, "response from order");

    revalidatePath("/");
    return { success: true, data: res };
  } catch (error: any) {
    console.log(error.message);
    throw new error(error.message);
  }
}

export async function SendOrderToSteadfast(courierData: SteadfastOrderPayload) {
  try {
    const response = await createSteadfastOrder(courierData);

    revalidatePath("/");
    return { success: true, data: response };
  } catch (error: any) {
    console.log(error.message);
    throw new error(error.message);
  }
}
