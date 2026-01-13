"use server";

import { revalidatePath } from "next/cache";
import { deleteQuote, updateQuote } from "./quote";

export async function DeleteQuote(quoteId: string) {
  try {
    const res = await deleteQuote(quoteId);
    revalidatePath("/");
    return { success: true, data: res };
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
}

export async function UpdateQuoteStatus(quoteId: string, status: string) {
  try {
    const statusEntry = { status: status };

    const res = await updateQuote(String(quoteId), statusEntry);

    revalidatePath("/");
    return { success: true, data: res };
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error.message);
  }
}
