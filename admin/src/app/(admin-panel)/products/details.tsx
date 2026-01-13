"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  SheetTitle,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, MoreHorizontal, Paperclip, Plus, Trash } from "lucide-react";
import React, { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { deleteProductAction, updateFormAction } from "./actions";
import {
  TBrand,
  TCategory,
  TChildCategory,
  TProduct,
  TSubCategory,
} from "@/types/shared";
import { confirmation } from "@/components/modals/confirm-modal";
import { productFormSchema } from "./form-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker, Upload, UploadFile } from "antd";
import {
  fileUrlGenerator,
  humanFileSize,
  makeFormData,
  urlToFile,
} from "@/utils/helpers";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { getAllCategory } from "@/services/category";
import { getAllSubCategory } from "@/services/sub-category";
import { getAllChildCategory } from "@/services/child-category";
import "react-quill/dist/quill.snow.css";
import { discountTypes, inventoryTypes } from "./form";
import { Label } from "@/components/ui/label";
import { upperCase, upperFirst } from "lodash";
import { getAllBrand } from "@/services/brand";
import imageCompression from "browser-image-compression";

// Lazy load ReactQuill - CRITICAL for performance
const ReactQuill = lazy(() => import("react-quill"));

const compressionOptions = {
  maxSizeMB: 0.07,          // 30 KB target
  maxWidthOrHeight: 600,    // reduce resolution
  useWebWorker: true,
  initialQuality: 0.5,     // important
};

// Compress single image with better error handling
const compressImage = async (file: File): Promise<File> => {
  try {
    const fileSizeKB = file.size / 1024;
    if (fileSizeKB <= 70) return file;

    const compressedBlob = await imageCompression(file, compressionOptions);
    return new File([compressedBlob], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Compression error:", error);
    return file;
  }
};

// Compress multiple images in parallel
const compressMultipleImages = async (files: File[]): Promise<File[]> => {
  return Promise.all(files.map(file => compressImage(file)));
};

interface Props {
  product: TProduct;
}

type InventoryForm = {
  id?: string;
  mrpPrice?: string;
  color?: string;
  size?: string;
  colorName?: string;
  quantity?: number;
};

export const ProductDetailsSheet = ({ product }: Props) => {
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageFileList, setImageFileList] = useState<UploadFile<any>[]>(
    product.images?.map((item, index) => ({
      uid: `-${index + 1}`,
      name: String(item).split("/").pop() || `image-${index + 1}`,
      status: "done",
      url: fileUrlGenerator(item),
    })) || []
  );


  const [thumbnailFileList, setThumbnailFileList] = useState<UploadFile<any>[]>(
    [
      {
        uid: "-1",
        name: String(product.thumbnailImage).split("/").pop() || "",
        status: "done",
        url: fileUrlGenerator(product.thumbnailImage || ""),
      },
    ]
  );


  const [brands, setBrands] = useState<TBrand[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [subCategories, setSubCategories] = useState<TSubCategory[]>([]);
  const [childCategories, setChildCategories] = useState<TChildCategory[]>([]);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      discountType: "",
      discount: "",
      freeShipping: "",
      brandRef: "",
      categoryRef: "",
      subCategoryRef: "",
      childCategoryRef: "",
      inventoryType: "",
      featured: false,
      images: [],
      thumbnailImage: [],
      backViewImage: [],
      sizeChartImage: [],
      inventories: [{ quantity: 0 } as InventoryForm],
      materials: [{ name: "" }],
    },
  });


  const selectedCategoryId = form.watch("categoryRef");
  const selectedSubCategoryId = form.watch("subCategoryRef");

  const { control, register, watch, formState } = form;
  const selectedInventoryType = watch("inventoryType");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventories",
  });

  // fabric, material, color, size field arrays
  const {
    fields: fabricFields,
    append: appendFabric,
    remove: removeFabric,
  } = useFieldArray({
    control,
    name: "fabrics",
  });

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({
    control,
    name: "colors",
  });

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: "sizes",
  });

  const {
    fields: setFields,
    append: appendSet,
    remove: removeSet,
  } = useFieldArray({
    control,
    name: "set",
  });

  const {
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial,
  } = useFieldArray({
    control,
    name: "materials",
  });


  //  Step 2: Product form reset 
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        discountType: product.discountType || "",
        discount: String(product.discount) || "",
        freeShipping: String(product.freeShipping),
        brandRef: product.brandRef?._id,
        categoryRef: product.categoryRef?._id,
        subCategoryRef: product.subCategoryRef?._id,
        childCategoryRef: product.childCategoryRef?._id,
        inventoryType: product.inventoryType,
        featured: product.featured,
        images: [],
        thumbnailImage: [],
        backViewImage: [],
        sizeChartImage: [],
        inventories: product.inventoryRef?.length
          ? product.inventoryRef.map((item: any) => ({
            quantity: String(item.quantity),
            ...(item._id && { id: item._id || "" }),
            ...(item.color && { color: item.color }),
            ...(item.name && { colorName: upperFirst(item.name) }),
            ...(item.level && { size: upperCase(item.level) }),
            ...(item.price && { price: upperCase(item.price) }),
            ...(item.mrpPrice && { mrpPrice: upperCase(item.mrpPrice) }),
          }))
          : [{ quantity: product.mainInventory }],
        videoUrl: product.videoUrl || "",
        material: product.material || "",

      });


      while (materialFields.length > 0) {
        removeMaterial(0);
      }
      //  Manually handle Fabrics
      //  clear 
      while (fabricFields.length > 0) {
        removeFabric(0);
      }
      //  product 
      if (product.fabrics?.length) {
        product.fabrics.forEach((fabric: any) => {
          appendFabric(fabric);
        });
      } else {
        //  product , default 
        appendFabric({ colorCode: "#1677ff", colorName: "", images: [] });
      }

      // Manually handle Colors
      while (colorFields.length > 0) {
        removeColor(0);
      }
      if (product.colors?.length) {
        product.colors.forEach((color: any) => {
          appendColor(color);
        });
      } else {
        appendColor({ colorName: "", images: [] });
      }

      //  Manually handle Sizes
      while (sizeFields.length > 0) {
        removeSize(0);
      }
      if (product.sizes?.length) {
        product.sizes.forEach((size: any) => {
          appendSize(size);
        });
      } else {
        appendSize({ sizeName: "", images: [] });
      }

      // Manually handle Set
      while (setFields.length > 0) {
        removeSet(0);
      }
      if (product.set?.length) {
        product.set.forEach((setItem: any) => {
          appendSet(setItem);
        });
      } else {
        appendSet({ setName: "", images: [] });
      }
    }
  }, [product]);


  const getDefaultInventory = () => {
    const base = { id: "", quantity: "", mrpPrice: "" };
    if (selectedInventoryType === "colorInventory")
      return { ...base, id: "", color: "#1677ff", colorName: "" };
    if (selectedInventoryType === "levelInventory")
      return { ...base, id: "", size: "" };
    if (selectedInventoryType === "colorLevelInventory")
      return { ...base, id: "", color: "#1677ff", colorName: "", size: "" };
    return base;
  };

  const selectedColor = form.watch("color");

  useEffect(() => {
    getAllBrand().then((data) => setBrands(data.data));
  }, []);

  useEffect(() => {
    getAllCategory().then((data) => setCategories(data.data));
  }, []);

  useEffect(() => {
    getAllSubCategory().then((data) => setSubCategories(data.data));
  }, []);

  useEffect(() => {
    getAllChildCategory().then((data) => setChildCategories(data.data));
  }, []);

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter(
      (subCat) => subCat?.categoryRef?._id === selectedCategoryId
    );
  }, [subCategories, selectedCategoryId]);

  const filteredChildCategories = useMemo(() => {
    return childCategories.filter(
      (childCat) => childCat?.subCategoryRef?._id === selectedSubCategoryId
    );
  }, [subCategories, selectedSubCategoryId]);


  useEffect(() => {
    if (product.thumbnailImage) {
      const fetchExistingThumbnail = async () => {
        const response = await fetch(fileUrlGenerator(product.thumbnailImage));
        const blob = await response.blob();
        const file = new File([blob], product.thumbnailImage, {
          type: blob.type,
        });

        // Set it to form field value and upload preview
        form.setValue("thumbnailImage", [file]); // This is key!
        setThumbnailFileList([
          {
            uid: "-1",
            name: product.thumbnailImage,
            url: fileUrlGenerator(product.thumbnailImage),
          },
        ]);
      };

      fetchExistingThumbnail();
    }
  }, [product.thumbnailImage]);



  const handleImageFileChange = ({ fileList }: any) => {
    setImageFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => {
        if (file.originFileObj) {
          return file.originFileObj;
        }
        return file.url;
      })
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("images", rawFiles);
  };

  const handleThumbnailFileChange = async ({ fileList }: any) => {
    setThumbnailFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => {
        if (file.originFileObj) {
          return file.originFileObj;
        }
        return file.url;
      })
      .filter(Boolean);

    const compressedFiles = await compressMultipleImages(rawFiles);

    // Sync with react-hook-form
    form.setValue("thumbnailImage", compressedFiles);
  };

  const onSubmitUpdate = async (values: z.infer<typeof productFormSchema>) => {
    setUpdating(true);
    const data = makeFormData(values);

    try {
      await updateFormAction(String(product._id), data);
      toast({
        title: "Product updated successfully",
      });
      setSheetOpen(false);
      setImageFileList([]);
      setThumbnailFileList([]);
      setBackViewFileList([]);
      setFabricImageFileLists({});
      setColorImageFileLists({});
      setSizeImageFileLists({});
      setSetImageFileLists({});
    } catch (error: any) {
      toast({
        title: "Failed to update product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this product?")) {
      setDeleting(true);
      console.log(product._id, "product id from han dle delete......");
      const deleted = await deleteProductAction(String(product._id));
      if (deleted) {
        toast({
          title: "Product deleted successfully",
        });
        setSheetOpen(false);
      }
    }
    setDeleting(false);
  };

  const ReactQuill = lazy(() => import("react-quill"));

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="sm:max-w-[1050px] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Product Details</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitUpdate)}
            className="grid grid-cols-12 gap-2 py-2"
          >
            {/* Text Inputs */}
            <div className="col-span-10">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Product Name <b className="text-red-500">*</b>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.name?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      {/* <Input placeholder="Enter product description" {...field} /> */}
                      <ReactQuill {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.description?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-1">
                <FormField
                  control={form.control}
                  name="brandRef"
                  render={({ field }) => (
                    <div className="flex items-end gap-2 w-full">
                      <FormItem className="flex-1">
                        <FormLabel>
                          Brand<b className="text-red-500">*</b>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select brand" />
                            </SelectTrigger>
                            <SelectContent>
                              {brands.map((item, index) => (
                                <SelectItem
                                  key={index}
                                  value={String(item._id)}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {form.formState.errors.brandRef?.message}
                        </FormDescription>
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryRef"
                  render={({ field }) => (
                    <div className="flex items-end gap-2 w-full">
                      <FormItem className="flex-1">
                        <FormLabel>
                          Category<b className="text-red-500">*</b>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((item, index) => (
                                <SelectItem
                                  key={index}
                                  value={String(item._id)}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {form.formState.errors.categoryRef?.message}
                        </FormDescription>
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subCategoryRef"
                  render={({ field }) => (
                    <div className="flex items-end gap-2 w-full">
                      <FormItem className="flex-1">
                        <FormLabel>Subcategory</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredSubCategories.map((item, index) => (
                                <SelectItem
                                  key={index}
                                  value={String(item._id)}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {form.formState.errors.subCategoryRef?.message}
                        </FormDescription>
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="childCategoryRef"
                  render={({ field }) => (
                    <div className="flex items-end gap-2 w-full">
                      <FormItem className="flex-1">
                        <FormLabel>Child Category</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select child category" />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredChildCategories.map((item, index) => (
                                <SelectItem
                                  key={index}
                                  value={String(item._id)}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {form.formState.errors.childCategoryRef?.message}
                        </FormDescription>
                      </FormItem>
                    </div>
                  )}
                />
              </div>

              {/* Fabrics & Colors - Side by Side */}
              <div className="col-span-3 grid grid-cols-3 gap-2">
                {/* Material */}
                <div className="my-4 border p-4 border-gray-300 rounded-md">
                  <div className="mb-4">
                    <FormLabel>Materials</FormLabel>
                  </div>
                  {materialFields.map((field, index) => (
                    <div
                      key={field.id}
                      className=" relative"
                    >
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter material name (e.g., Cotton, Polyester)"
                            {...register(`materials.${index}.name`)}
                          />
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {formState.errors?.materials?.[index]?.name?.message}
                        </FormDescription>
                      </FormItem>

                      {/* Delete Button - Only show if more than 1 material */}
                      {materialFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeMaterial(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={() => appendMaterial({ name: "" })}
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Material
                  </Button>
                </div>

                {/* Fabrics - Dynamic with Color & Images */}
                <div className="my-4 border p-4 border-gray-300 rounded-md">
                  <div className="mb-4">
                    <FormLabel>Fabrics</FormLabel>
                  </div>
                  {fabricFields.map((field, index) => (
                    <div
                      key={field.id}
                      className=" relative"
                    >
                      <div className=" gap-2">
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Enter color name"
                              {...register(`fabrics.${index}.colorName`)}
                            />
                          </FormControl>
                          <FormDescription className="text-red-400 text-xs min-h-4">
                            {formState.errors?.fabrics?.[index]?.colorName?.message}
                          </FormDescription>
                        </FormItem>
                      </div>

                      {/* Delete Button - Only show if more than 1 fabric */}
                      {fabricFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            removeFabric(index);
                            // Remove the fileList for this index
                            setFabricImageFileLists((prev) => {
                              const newLists = { ...prev };
                              delete newLists[index];
                              return newLists;
                            });
                          }}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={() =>
                      appendFabric({
                        colorCode: "#1677ff",
                        colorName: "",
                        images: [],
                      })
                    }
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Fabric
                  </Button>
                </div>


                {/* Colors - Dynamic */}
                <div className="my-4 border p-4 border-gray-300 rounded-md">
                  <div className="mb-4">
                    <FormLabel >Colors</FormLabel>
                  </div>
                  {colorFields.map((field, index) => (
                    <div
                      key={field.id}
                      className=" relative"
                    >
                      <div className=" gap-2 ">
                        {/* Color Name */}
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Enter color name"
                              {...register(`colors.${index}.colorName`)}
                            />
                          </FormControl>
                          <FormDescription className="text-red-400 text-xs min-h-4">
                            {
                              formState.errors?.colors?.[index]?.colorName
                                ?.message
                            }
                          </FormDescription>
                        </FormItem>
                      </div>

                      {/* Delete Button */}
                      {colorFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            removeColor(index);
                            setColorImageFileLists((prev) => {
                              const newLists = { ...prev };
                              delete newLists[index];
                              return newLists;
                            });
                          }}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={() =>
                      appendColor({
                        colorName: "",
                        images: [],
                      })
                    }
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Color
                  </Button>
                </div>

              </div>


              {/* Sizes & Sets - Side by Side */}
              <div className="col-span-3 grid grid-cols-2 gap-2">
                {/* Sizes - Dynamic */}
                <div className="my-4 border p-4 border-gray-300 rounded-md">
                  <div className="mb-4" >
                    <FormLabel>Sizes</FormLabel>
                  </div>
                  {sizeFields.map((field, index) => (
                    <div
                      key={field.id}
                      className=" relative"
                    >
                      <div className="gap-2 mb-2">
                        {/* size Name */}
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Enter size name"
                              {...register(`sizes.${index}.sizeName`)}
                            />
                          </FormControl>
                          <FormDescription className="text-red-400 text-xs min-h-4">
                            {formState.errors?.sizes?.[index]?.sizeName?.message}
                          </FormDescription>
                        </FormItem>
                      </div>

                      {/* Delete Button */}
                      {sizeFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            removeSize(index);
                            setSizeImageFileLists((prev) => {
                              const newLists = { ...prev };
                              delete newLists[index];
                              return newLists;
                            });
                          }}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={() =>
                      appendSize({
                        sizeName: "",
                        images: [],
                      })
                    }
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Size
                  </Button>
                </div>

                {/* Set - Dynamic with Images */}
                <div className="my-4 border p-4 border-gray-300 rounded-md">
                  <div className="mb-4">
                    <FormLabel>Sets</FormLabel>
                  </div>
                  {setFields.map((field, index) => (
                    <div
                      key={field.id}
                      className=" relative"
                    >
                      <div className=" gap-2">
                        {/* Set Name */}
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter set name"
                              {...register(`set.${index}.setName`)}
                            />
                          </FormControl>
                          <FormDescription className="text-red-400 text-xs min-h-4">
                            {formState.errors?.set?.[index]?.setName?.message}
                          </FormDescription>
                        </FormItem>
                      </div>

                      {/* Delete Button */}
                      {setFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            removeSet(index);
                            setSetImageFileLists((prev) => {
                              const newLists = { ...prev };
                              delete newLists[index];
                              return newLists;
                            });
                          }}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={() => appendSet({ setName: "", images: [] })}
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Set
                  </Button>
                </div>
              </div>

              {selectedInventoryType !== "" &&
                fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-4 gap-1 border p-2 mb-2 rounded-md space-y-2 relative justify-center items-center"
                  >
                    {(selectedInventoryType === "colorInventory" ||
                      selectedInventoryType === "colorLevelInventory") && (
                        <Controller
                          control={control}
                          name={`inventories.${index}.color`}
                          render={({ field }) => {
                            const [colorPickerOpen, setColorPickerOpen] =
                              useState(false);
                            return (
                              <FormItem className="flex flex-col">
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                  <ColorPicker
                                    value={field.value || "#1677ff"}
                                    showText
                                    allowClear
                                    open={colorPickerOpen}
                                    onOpenChange={setColorPickerOpen}
                                    getPopupContainer={(trigger) =>
                                      (trigger.parentNode as HTMLElement) ||
                                      document.body
                                    } // Prevents portal jumpiness
                                    onChange={(color) =>
                                      field.onChange(color.toHexString())
                                    }
                                  />
                                </FormControl>
                                <FormDescription className="text-red-400 text-xs min-h-4">
                                  {
                                    formState.errors?.inventories?.[index]?.color
                                      ?.message
                                  }
                                </FormDescription>
                              </FormItem>
                            );
                          }}
                        />
                      )}

                    {(selectedInventoryType === "colorInventory" ||
                      selectedInventoryType === "colorLevelInventory") && (
                        <FormItem>
                          <FormLabel>Color Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter color name"
                              {...register(`inventories.${index}.colorName`)}
                            />
                          </FormControl>
                          <FormDescription className="text-red-400 text-xs min-h-4">
                            {
                              formState.errors?.inventories?.[index]?.colorName
                                ?.message
                            }
                          </FormDescription>
                        </FormItem>
                      )}

                    {(selectedInventoryType === "levelInventory" ||
                      selectedInventoryType === "colorLevelInventory") && (
                        <FormItem>
                          <FormLabel>Size</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter size"
                              {...register(`inventories.${index}.size`)}
                            />
                          </FormControl>
                          <FormDescription className="text-red-400 text-xs min-h-4">
                            {
                              formState.errors?.inventories?.[index]?.size
                                ?.message
                            }
                          </FormDescription>
                        </FormItem>
                      )}

                    {selectedInventoryType !== "" && (
                      <>
                        {/* <FormItem>
                          <FormLabel>
                            Quantity <b className="text-red-500">*</b>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter quantity"
                              {...register(`inventories.${index}.quantity` as any)}
                            />
                          </FormControl>
                          <FormDescription className="text-red-400 text-xs min-h-4">
                            {
                              formState.errors?.inventories?.[index]?.quantity
                                ?.message as string}
                            }
                          </FormDescription>
                        </FormItem> */}

                        <FormItem>
                          <FormLabel>
                            MRP (Maximum Retail Price){" "}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter mrpPrice"
                              {...register(`inventories.${index}.mrpPrice`)}
                            />
                          </FormControl>
                          <FormDescription className="text-red-400 text-xs min-h-4">
                            {
                              formState.errors?.inventories?.[index]?.mrpPrice
                                ?.message
                            }
                          </FormDescription>
                        </FormItem>
                      </>
                    )}

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => remove(index)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

              {selectedInventoryType !== "inventory" &&
                selectedInventoryType !== "" && (
                  <Button
                    type="button"
                    onClick={() => append(getDefaultInventory())}
                    variant="outline"
                    className="mt-2 w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                )}

              {/* Video URL */}
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Video URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter video URL" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.videoUrl?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 mt-2 py-4">
                    {/* Label */}
                    <FormLabel className="mb-0">Featured Product</FormLabel>
                    {/* Checkbox */}
                    <FormControl className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="w-5 h-5 accent-red-600 cursor-pointer"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="my-4 flex gap-2">
                <Button
                  // disabled
                  type="submit"
                  variant="default"
                  loading={updating}
                >
                  Update
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteClick}
                  loading={deleting}
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="col-span-2 min-h-[500px] grid grid-cols-1">
              <div className="">
                <Label>
                  Thumbnail Image (Max 1 File) <b className="text-red-500">*</b>
                </Label>
                <FormField
                  control={form.control}
                  name="thumbnailImage"
                  render={({ field }) => (
                    <div>
                      <Upload
                        listType="picture-card"
                        beforeUpload={() => false}
                        fileList={thumbnailFileList}
                        onChange={handleThumbnailFileChange}
                        multiple={false}
                      >
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      </Upload>
                    </div>
                  )}
                />

                <div className="mt-4">
                  {form.getValues("thumbnailImage") &&
                    form.getValues("thumbnailImage").length > 0 &&
                    form.getValues("thumbnailImage").map((file, i) => (
                      <div className="border-dashed border-2 rounded-lg p-2 px-3">
                        <div
                          key={i}
                          className="flex flex-col gap-2 text-xs text-gray-500 justify-center h-full"
                        >
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileUp className="h-4 w-4 stroke-current" />
                            <span>{humanFileSize(file.size)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.thumbnailImage?.message}
                </div>
              </div>

              <div className="">

                <div className="mt-4">
                  {form.getValues("backViewImage") &&
                    form.getValues("backViewImage").length > 0 &&
                    form.getValues("backViewImage").map((file, i) => (
                      <div className="border-dashed border-2 rounded-lg p-2 px-3">
                        <div
                          key={i}
                          className="flex flex-col gap-2 text-xs text-gray-500 justify-center h-full"
                        >
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileUp className="h-4 w-4 stroke-current" />
                            <span>{humanFileSize(file.size)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.backViewImage?.message}
                </div>
              </div>

              <div className="">
                <Label>Optional Images</Label>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <div>
                      <Upload
                        listType="picture-card"
                        beforeUpload={() => false}
                        fileList={imageFileList}
                        onChange={({ fileList }) => {
                          setImageFileList(fileList);
                          form.setValue("images", fileList);
                        }}
                      >
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      </Upload>
                    </div>
                  )}
                />

                <div className="mt-4">
                  {form.getValues("images") &&
                    form.getValues("images").length > 0 &&
                    form.getValues("images").map((file, i) => (
                      <div className="border-dashed border-2 rounded-lg p-2 px-3">
                        <div
                          key={i}
                          className="flex flex-col gap-2 text-xs text-gray-500 justify-center h-full"
                        >
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileUp className="h-4 w-4 stroke-current" />
                            <span>{humanFileSize(file.size)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.images?.message}
                </div>
              </div>
              {/* 
              <div className="">
                <Label>Size Chart Image (Max 1 File) </Label>
                <FormField
                  control={form.control}
                  name="sizeChartImage"
                  render={({ field }) => (
                    <div>
                      <Upload
                        listType="picture-card"
                        beforeUpload={() => false}
                        fileList={sizeChartFileList}
                        onChange={handleSizeChartFileChange}
                        multiple={false}
                      >
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      </Upload>
                    </div>
                  )}
                />

                <div className="mt-4">
                  {form.getValues("sizeChartImage") &&
                    form.getValues("sizeChartImage").length > 0 &&
                    form.getValues("sizeChartImage").map((file, i) => (
                      <div className="border-dashed border-2 rounded-lg p-2 px-3">
                        <div
                          key={i}
                          className="flex flex-col gap-2 text-xs text-gray-500 justify-center h-full"
                        >
                          <div className="flex items-center gap-2">
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileUp className="h-4 w-4 stroke-current" />
                            <span>{humanFileSize(file.size)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.sizeChartImage?.message}
                </div>
              </div> */}
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
