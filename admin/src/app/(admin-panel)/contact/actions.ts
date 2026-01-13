"use server";

import { deleteContact } from "@/services/contact";
import { TCategory } from "@/types/shared";
import { revalidatePath } from "next/cache";

export async function deleteAction(id: string) {
  // const category = await getCategoryById(id);

  try {
    await deleteContact(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
