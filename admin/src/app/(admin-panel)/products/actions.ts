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

    // ✅ NEW: Process fabrics data
    // Extract all fabric-related entries from FormData
    const fabricData: any[] = [];
    const fabricKeys = Array.from(data.keys()).filter((key) =>
      key.startsWith("fabrics[")
    );

    // Group by fabric index
    const fabricIndices = new Set(
      fabricKeys
        .map((key) => {
          const match = key.match(/fabrics\[(\d+)\]/);
          return match ? parseInt(match[1]) : -1;
        })
        .filter((index) => index !== -1)
    );

    fabricIndices.forEach((index) => {
      const colorCode = data.get(`fabrics[${index}][colorCode]`) as string;
      const colorName = data.get(`fabrics[${index}][colorName]`) as string;
      const images = data.getAll(`fabrics[${index}][images]`);

      fabricData.push({
        colorCode,
        colorName,
        images: images.length > 0 ? images : [],
      });

      // Clean up the individual fabric entries from FormData so backend
      // receives them via the `fabrics` JSON payload instead
      data.delete(`fabrics[${index}][colorCode]`);
      data.delete(`fabrics[${index}][colorName]`);
      data.delete(`fabrics[${index}][images]`);
    });

    // Send fabrics metadata as JSON (without binary files for now)
    // Backend will receive this as `req.body.fabrics`
    const fabricsPayload = fabricData.map((f) => ({
      colorCode: f.colorCode,
      colorName: f.colorName,
      images: [], // Images will be uploaded separately and added by backend
    }));
    data.set("fabrics", JSON.stringify(fabricsPayload));

    // Re-append fabric images with clear naming so ImgUploader processes them
    fabricData.forEach((fabric, index) => {
      if (Array.isArray(fabric.images)) {
        fabric.images.forEach((image: any) => {
          data.append(`fabricImages_${index}`, image);
        });
      }
    });

    // Process colors data
    const colorData: any[] = [];
    const colorKeys = Array.from(data.keys()).filter((key) =>
      key.startsWith("colors[")
    );

    const colorIndices = new Set(
      colorKeys
        .map((key) => {
          const match = key.match(/colors\[(\d+)\]/);
          return match ? parseInt(match[1]) : -1;
        })
        .filter((index) => index !== -1)
    );

    colorIndices.forEach((index) => {
      const colorCode = data.get(`colors[${index}][colorCode]`) as string;
      const colorName = data.get(`colors[${index}][colorName]`) as string;
      const images = data.getAll(`colors[${index}][images]`);

      colorData.push({
        colorCode,
        colorName,
        images: images.length > 0 ? images : [],
      });

      data.delete(`colors[${index}][colorCode]`);
      data.delete(`colors[${index}][colorName]`);
      data.delete(`colors[${index}][images]`);
    });

    const colorsPayload = colorData.map((c) => ({
      colorCode: c.colorCode,
      colorName: c.colorName,
      images: [],
    }));
    data.set("colors", JSON.stringify(colorsPayload));

    colorData.forEach((color, index) => {
      if (Array.isArray(color.images)) {
        color.images.forEach((image: any) => {
          data.append(`colorImages_${index}`, image);
        });
      }
    });

    // Process sizes data
    const sizeData: any[] = [];
    const sizeKeys = Array.from(data.keys()).filter((key) =>
      key.startsWith("sizes[")
    );

    const sizeIndices = new Set(
      sizeKeys
        .map((key) => {
          const match = key.match(/sizes\[(\d+)\]/);
          return match ? parseInt(match[1]) : -1;
        })
        .filter((index) => index !== -1)
    );

    sizeIndices.forEach((index) => {
      const colorCode = data.get(`sizes[${index}][colorCode]`) as string;
      const colorName = data.get(`sizes[${index}][colorName]`) as string;
      const images = data.getAll(`sizes[${index}][images]`);

      sizeData.push({
        colorCode,
        colorName,
        images: images.length > 0 ? images : [],
      });

      data.delete(`sizes[${index}][colorCode]`);
      data.delete(`sizes[${index}][colorName]`);
      data.delete(`sizes[${index}][images]`);
    });

    const sizesPayload = sizeData.map((s) => ({
      colorCode: s.colorCode,
      colorName: s.colorName,
      images: [],
    }));
    data.set("sizes", JSON.stringify(sizesPayload));

    sizeData.forEach((size, index) => {
      if (Array.isArray(size.images)) {
        size.images.forEach((image: any) => {
          data.append(`sizeImages_${index}`, image);
        });
      }
    });

    // Process set data
    const setData: any[] = [];
    const setKeys = Array.from(data.keys()).filter((key) =>
      key.startsWith("set[")
    );

    const setIndices = new Set(
      setKeys
        .map((key) => {
          const match = key.match(/set\[(\d+)\]/);
          return match ? parseInt(match[1]) : -1;
        })
        .filter((index) => index !== -1)
    );

    setIndices.forEach((index) => {
      const setName = data.get(`set[${index}][setName]`) as string;
      const images = data.getAll(`set[${index}][images]`);

      setData.push({
        setName,
        images: images.length > 0 ? images : [],
      });

      data.delete(`set[${index}][setName]`);
      data.delete(`set[${index}][images]`);
    });

    const setPayload = setData.map((s) => ({
      setName: s.setName,
      images: [],
    }));
    data.set("set", JSON.stringify(setPayload));

    setData.forEach((setItem, index) => {
      if (Array.isArray(setItem.images)) {
        setItem.images.forEach((image: any) => {
          data.append(`setImages_${index}`, image);
        });
      }
    });

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

    // ✅ Process fabrics data for update as well (mirror create behavior)
    const fabricData: any[] = [];
    const fabricKeys = Array.from(data.keys()).filter((key) =>
      key.startsWith("fabrics[")
    );

    const fabricIndices = new Set(
      fabricKeys
        .map((key) => {
          const match = key.match(/fabrics\[(\d+)\]/);
          return match ? parseInt(match[1]) : -1;
        })
        .filter((index) => index !== -1)
    );

    fabricIndices.forEach((index) => {
      const colorCode = data.get(`fabrics[${index}][colorCode]`) as string;
      const colorName = data.get(`fabrics[${index}][colorName]`) as string;
      const images = data.getAll(`fabrics[${index}][images]`);

      fabricData.push({
        colorCode,
        colorName,
        images: images.length > 0 ? images : [],
      });
    });

    // add colors processing
    const colorData: any[] = [];
    const colorKeys = Array.from(data.keys()).filter((key) =>
      key.startsWith("colors[")
    );

    const colorIndices = new Set(
      colorKeys
        .map((key) => {
          const match = key.match(/colors\[(\d+)\]/);
          return match ? parseInt(match[1]) : -1;
        })
        .filter((index) => index !== -1)
    );

    colorIndices.forEach((index) => {
      const colorCode = data.get(`colors[${index}][colorCode]`) as string;
      const colorName = data.get(`colors[${index}][colorName]`) as string;
      const images = data.getAll(`colors[${index}][images]`);

      colorData.push({
        colorCode,
        colorName,
        images: images.length > 0 ? images : [],
      });
    });
    
    // Sizes data processing
    const sizeData: any[] = [];
    const sizeKeys = Array.from(data.keys()).filter((key) =>
      key.startsWith("sizes[")
    );

    const sizeIndices = new Set(
      sizeKeys
        .map((key) => {
          const match = key.match(/sizes\[(\d+)\]/);
          return match ? parseInt(match[1]) : -1;
        })
        .filter((index) => index !== -1)
    );

    sizeIndices.forEach((index) => {
      const colorCode = data.get(`sizes[${index}][colorCode]`) as string;
      const colorName = data.get(`sizes[${index}][colorName]`) as string;
      const images = data.getAll(`sizes[${index}][images]`);

      sizeData.push({
        colorCode,
        colorName,
        images: images.length > 0 ? images : [],
      });
    });

    // Set data processing
    const setData: any[] = [];
    const setKeys = Array.from(data.keys()).filter((key) =>
      key.startsWith("set[")
    );

    const setIndices = new Set(
      setKeys
        .map((key) => {
          const match = key.match(/set\[(\d+)\]/);
          return match ? parseInt(match[1]) : -1;
        })
        .filter((index) => index !== -1)
    );

    setIndices.forEach((index) => {
      const setName = data.get(`set[${index}][setName]`) as string;
      const images = data.getAll(`set[${index}][images]`);

      setData.push({
        setName,
        images: images.length > 0 ? images : [],
      });
    });

    // Build updated form data by copying original entries (except inventories and fabric entries)
    for (const [key, value] of data.entries()) {
      if (key === "inventories") continue;
      if (key.startsWith("fabrics[")) continue;
      if (key.startsWith("colors[")) continue;
      if (key.startsWith("sizes[")) continue;
      if (key.startsWith("set[")) continue;
      updatedFormData.append(key, value);
    }

    // Append inventoryArray
    updatedFormData.append("inventoryArray", JSON.stringify(inventoryArray));

    // Add fabrics payload as JSON (without binary files)
    const fabricsPayload = fabricData.map((f) => ({
      colorCode: f.colorCode,
      colorName: f.colorName,
      images: [], // Images will be uploaded separately and added by backend
    }));

    updatedFormData.append("fabrics", JSON.stringify(fabricsPayload));

    // After fabrics append
    updatedFormData.append(
      "colors",
      JSON.stringify(
        colorData.map((c) => ({
          colorCode: c.colorCode,
          colorName: c.colorName,
          images: [],
        }))
      )
    );

    updatedFormData.append(
      "sizes",
      JSON.stringify(
        sizeData.map((s) => ({
          colorCode: s.colorCode,
          colorName: s.colorName,
          images: [],
        }))
      )
    );

    updatedFormData.append(
      "set",
      JSON.stringify(
        setData.map((s) => ({
          setName: s.setName,
          images: [],
        }))
      )
    );

    // Re-append fabric images with clear naming so ImgUploader processes them
    fabricData.forEach((fabric, index) => {
      if (Array.isArray(fabric.images)) {
        fabric.images.forEach((image: any) => {
          updatedFormData.append(`fabricImages_${index}`, image);
        });
      }
    });

    // Re-append images
    colorData.forEach((color, index) => {
      if (Array.isArray(color.images)) {
        color.images.forEach((image: any) => {
          updatedFormData.append(`colorImages_${index}`, image);
        });
      }
    });

    sizeData.forEach((size, index) => {
      if (Array.isArray(size.images)) {
        size.images.forEach((image: any) => {
          updatedFormData.append(`sizeImages_${index}`, image);
        });
      }
    });

    setData.forEach((setItem, index) => {
      if (Array.isArray(setItem.images)) {
        setItem.images.forEach((image: any) => {
          updatedFormData.append(`setImages_${index}`, image);
        });
      }
    });

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
