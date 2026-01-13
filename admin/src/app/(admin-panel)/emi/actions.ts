"use server";

import { revalidatePath } from "next/cache";

export async function revalidateEmiPage() {
  revalidatePath("/admin/emi");
}
