"use server";

import {
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/services/product";
import { revalidatePath } from "next/cache";

export async function createFormAction(data: FormData) {
  try {
    const inventoryType = data.get("inventoryType");
    const inventoryEntries = data.getAll("inventories") as string[];
    const parsed = inventoryEntries.map((inv) => JSON.parse(inv));
    let inventoryArray: any[] = [];
    if (inventoryType === "colorLevelInventory") {
      // Group by level for color-level inventory
      const grouped: Record<string, any[]> = {};
      parsed.forEach((item) => {
        const level = item.size;
        if (!grouped[level]) grouped[level] = [];
        grouped[level].push({
          color: item.colorName,
          colorCode: item.color,
          quantity: item.quantity,
          barcode: item.barcode || "",
          mrpPrice: item.mrpPrice,
        });
      });
      inventoryArray = Object.entries(grouped).map(([level, colorLevel]) => ({
        level,
        colorLevel,
      }));
    } else if (inventoryType === "colorInventory") {
      // Direct color-based entries
      inventoryArray = parsed.map((item) => ({
        color: item.colorName,
        colorCode: item.color,
        quantity: item.quantity,
        barcode: item.barcode || "",
        mrpPrice: item.mrpPrice,
      }));
    } else if (inventoryType === "levelInventory") {
      // Direct size/level-based entries
      inventoryArray = parsed.map((item) => ({
        level: item.size,
        quantity: item.quantity,
        barcode: item.barcode || "",
        mrpPrice: item.mrpPrice,
      }));
    } else if (inventoryType === "inventory") {
      // Simple inventory — single quantity
      inventoryArray = parsed.map((item) => ({
        quantity: item.quantity,
        barcode: item.barcode || "",
        mrpPrice: item.mrpPrice,
      }));
      // Also set raw quantity for simplified access
      data.set("inventory", parsed[0]?.quantity || "0");
    }

    data.delete("inventories");
    data.set("inventoryArray", JSON.stringify(inventoryArray));
    console.log("✅ Sending FormData to backend...", data);
    await createProduct(data);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateFormAction(id: string, data: FormData) {
  try {
    const inventoryType = data.get("inventoryType");
    const inventoryEntries = data.getAll("inventories") as string[];
    const parsed = inventoryEntries.map((inv) => JSON.parse(inv));
console.log("parsed inventory entries", parsed);
    let inventoryArray: any[] = [];

    if (inventoryType === "colorLevelInventory") {
      const grouped: Record<string, any[]> = {};
      parsed.forEach((item) => {
        const level = item.size;
        if (!grouped[level]) grouped[level] = [];
        grouped[level].push({
          id: item.id,
          color: item.colorName,
          colorCode: item.color,
          quantity: item.quantity,
          barcode: item.barcode || "",
          mrpPrice: item.mrpPrice,
        });
      });

      inventoryArray = Object.entries(grouped).map(([level, colorLevel]) => ({
        level,
        colorLevel,
      }));
    } else if (inventoryType === "colorInventory") {
      inventoryArray = parsed.map((item) => ({
        id: item.id,
        color: item.colorName,
        colorCode: item.color,
        quantity: item.quantity,
        barcode: item.barcode || "",
        mrpPrice: item.mrpPrice,
      }));
    } else if (inventoryType === "levelInventory") {
      inventoryArray = parsed.map((item) => ({
        id: item.id,
        level: item.size,
        quantity: item.quantity,
        barcode: item.barcode || "",
        mrpPrice: item.mrpPrice,
      }));
    } else if (inventoryType === "inventory") {
      inventoryArray = parsed.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        barcode: item.barcode || "",
        mrpPrice: item.mrpPrice,
      }));
      data.set("inventory", parsed[0]?.quantity || "0");
    }

    // data.delete("inventories");
    // data.set("inventoryArray", JSON.stringify(inventoryArray));

    const updatedFormData = new FormData();

    for (const [key, value] of data.entries()) {
      if (key === "inventories") continue;
      updatedFormData.append(key, value);
    }

    updatedFormData.append("inventoryArray", JSON.stringify(inventoryArray));

    console.log("✅ Updating product with data:", updatedFormData);
    await updateProduct(id, updatedFormData);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteProductAction(id: string) {
  // const product = await getProductById(id);

  try {
    await deleteProduct(id);
    revalidatePath("/");
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
