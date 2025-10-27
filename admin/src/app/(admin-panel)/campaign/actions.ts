"use server";

import {
  createCampaign,
  deleteCampaign,
  getCampaignById,
  updateCampaign,
} from "@/services/campaign";
import { revalidatePath } from "next/cache";

export async function createFormAction(data: FormData) {
  try {
    const couponEntry = {
      name: data.get("name") as string,
      couponRef: data.get("couponRef") as string,
    };
    await createCampaign(couponEntry);

    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateFormAction(id: string, data: any) {
  try {
    const couponEntry = {
      name: data.get("name") as string,
      couponRef: data.get("couponRef") as string,
    };

    await updateCampaign(id, couponEntry);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteCampaignAction(id: string) {
  const campaign = await getCampaignById(id);

  try {
    await deleteCampaign(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
