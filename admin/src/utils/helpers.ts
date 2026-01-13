import { Table } from "@tanstack/react-table";

export function makeInitials(name: string) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return initials.toUpperCase();
}

export function makeFormData(data: Record<string, any>) {
  const formData = new FormData();
  console.log("FormData", data);

  Object.entries(data).forEach(([key, value]) => {
    if (key === "files" && Array.isArray(value) && value.length > 0) {
      if (value[0]?.originFileObj) {
        formData.append("image", value[0].originFileObj); // AntD file
      }
    }

    //  Materials handle 
    else if (key === "materials" && Array.isArray(value)) {
      formData.append("materials", JSON.stringify(value));
    }

    // Fix: Skip invalid image objects (URLs, placeholders)
    else if (
      ["images", "thumbnailImage", "backViewImage", "sizeChartImage"].includes(
        key
      )
    ) {
      if (Array.isArray(value) && value.length > 0) {
        const validFiles = value.filter(
          (file) => file?.originFileObj instanceof File || file instanceof File
        );

        if (validFiles.length > 0) {
          validFiles.forEach((file) => {
            if (file?.originFileObj) {
              formData.append(key, file.originFileObj);
            } else if (file instanceof File) {
              formData.append(key, file);
            }
          });
        }
      }
    }

    //  Handle fabrics array with nested images
    else if (key === "fabrics" && Array.isArray(value)) {
      value.forEach((fabric, index) => {
        // Append colorCode and colorName as JSON string
        formData.append(`fabrics[${index}][colorCode]`, fabric.colorCode || "");
        formData.append(`fabrics[${index}][colorName]`, fabric.colorName || "");

        // Handle fabric images
        if (Array.isArray(fabric.images) && fabric.images.length > 0) {
          fabric.images.forEach((file: any) => {
            if (file?.originFileObj) {
              formData.append(`fabrics[${index}][images]`, file.originFileObj);
            } else if (file instanceof File) {
              formData.append(`fabrics[${index}][images]`, file);
            }
          });
        }
      });
    }

    // Handle colors array with nested images
    else if (key === "colors" && Array.isArray(value)) {
      value.forEach((color, index) => {
        formData.append(`colors[${index}][colorName]`, color.colorName || "");

        // Handle color images
        if (Array.isArray(color.images) && color.images.length > 0) {
          color.images.forEach((file: any) => {
            if (file?.originFileObj) {
              formData.append(`colors[${index}][images]`, file.originFileObj);
            } else if (file instanceof File) {
              formData.append(`colors[${index}][images]`, file);
            }
          });
        }
      });
    }

    // Handle sizes array with nested images
    else if (key === "sizes" && Array.isArray(value)) {
      value.forEach((size, index) => {
        formData.append(`sizes[${index}][sizeName]`, size.sizeName || "");

        // Handle size images
        if (Array.isArray(size.images) && size.images.length > 0) {
          size.images.forEach((file: any) => {
            if (file?.originFileObj) {
              formData.append(`sizes[${index}][images]`, file.originFileObj);
            } else if (file instanceof File) {
              formData.append(`sizes[${index}][images]`, file);
            }
          });
        }
      });
    }

    // Handle set array with nested images   
    else if (key === "set" && Array.isArray(value)) {
      value.forEach((setItem, index) => {
        formData.append(`set[${index}][setName]`, setItem.setName || "");

        if (Array.isArray(setItem.images) && setItem.images.length > 0) {
          setItem.images.forEach((file: any) => {
            if (file?.originFileObj) {
              formData.append(`set[${index}][images]`, file.originFileObj);
            } else if (file instanceof File) {
              formData.append(`set[${index}][images]`, file);
            }
          });
        }
      });
    }

    // inventories array
    else if (key === "inventories" && Array.isArray(value)) {
      value.forEach((inventory) => {
        formData.append(key, JSON.stringify(inventory));
      });
    }

    // Other arrays
    else if (Array.isArray(value)) {
      value.forEach((v) => {
        formData.append(key, v);
      });
    }

    // All other fields
    else {
      formData.append(key, value);
    }
  });

  return formData;
}

export function humanFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

export function filenameGenerator(filename: string, key: string, dir: string) {
  const randomString = Math.random().toString(36).substring(2, 7);
  const extension = filename.split(".").pop();
  const currentTimestampString = new Date().getTime().toString();
  return `${dir}/${key}-${randomString}-${currentTimestampString}.${extension}`;
}

export function fileUrlGenerator(filename: string) {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}${filename}`;
}

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function makeProductCode(id: number) {
  return id.toString().padStart(4, "0");
}

export function makePrice(price: string | number) {
  const amount = typeof price === "string" ? parseFloat(price) : price;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
  }).format(amount);

  return formatted;
}

export function makeBDPrice(price: string | number) {
  const amount = typeof price === "string" ? parseFloat(price) : price;

  // Format according to the Bangladeshi numbering system
  const formatted = amount?.toLocaleString("en-IN", {
    // style: "currency",
    // currency: "BDT",
    minimumFractionDigits: 0,
  });

  return `৳ ${formatted}`;
}

export function getTotalFromTable<T>(table: Table<T>, index: number) {
  return table
    .getRowModel()
    .rows.map((row) => {
      const product = row.original as any;

      // Ensure the correct index is used for calculations
      if (index === 6) {
        return product.cost * product.quantity; // Stock Value
      } else if (index === 7) {
        return product.selling_price * product.quantity; // Sell Value
      } else if (index === 5) {
        return product.quantity; // Stock Quantity
      }

      return 0;
    })
    .reduce((acc, cur) => acc + cur, 0);
}

export function toUpperCaseWords(str: string) {
  return str
    .split(" ")
    .map((word) => word.toUpperCase())
    .join(" ");
}

export function getFirst50Characters(input: string) {
  if (typeof input !== "string") {
    throw new Error("Input must be a string");
  }
  return input.length > 50 ? input.slice(0, 50) + " ..." : input;
}

export const sanitizeNumber = (value: any) =>
  value === "null" || value === null || value === undefined || value === ""
    ? null
    : Number(value);

export const truncateText = (text: string, length: number = 100) => {
  if (text && text.length > length) {
    return `${text.substring(0, length)}...`;
  }
  return text;
};

export const urlToFile = async (
  url: string,
  filename: string
): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};
