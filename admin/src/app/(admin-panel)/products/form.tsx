"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { productFormSchema, dropZoneConfig } from "./form-schema";
import { FileUp, Paperclip, Plus, Trash } from "lucide-react";
import { humanFileSize, makeFormData } from "@/utils/helpers";
import { createFormAction } from "./actions";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Label } from "@/components/ui/label";
import {
  TBrand,
  TCategory,
  TChildCategory,
  TSubCategory,
} from "@/types/shared";
import { ColorPicker } from "antd";
import { getAllCategory } from "@/services/category";
import { getAllSubCategory } from "@/services/sub-category";
import { getAllChildCategory } from "@/services/child-category";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getAllBrand } from "@/services/brand";
import imageCompression from "browser-image-compression";


const compressionOptions = {
  maxSizeMB: 0.07,          // 30 KB target
  maxWidthOrHeight: 600,    // reduce resolution
  useWebWorker: true,
  initialQuality: 0.5,     // important
};

// Compress single image
const compressImage = async (file: File): Promise<File> => {
  try {
    const fileSizeKB = file.size / 1024;

    console.log(`Original: ${(file.size / 1024).toFixed(2)} KB`);

    if (fileSizeKB <= 70) return file;

    const compressedBlob = await imageCompression(file, compressionOptions);

    console.log(`Compressed: ${(compressedBlob.size / 1024).toFixed(2)} KB`);

    //  Blob File এconvert 
    const compressedFile = new File(
      [compressedBlob],
      file.name,
      {
        type: file.type,
        lastModified: Date.now(),
      }
    );

    return compressedFile;

  } catch (error) {
    console.error("Compression error:", error);
    return file;
  }
};



// Compress multiple images
const compressMultipleImages = async (files: File[]): Promise<File[]> => {
  const promises = files.map(file => compressImage(file));
  return Promise.all(promises);
};

const defaultValues = {
  name: "",
  description: "",
  brandRef: "",
  discountType: "",
  discount: "",
  // mrpPrice: "",
  freeShipping: "false",
  categoryRef: "",
  subCategoryRef: "",
  childCategoryRef: "",
  inventoryType: "inventory",
  // inventories: [],
  images: [],
  thumbnailImage: [],
  backViewImage: [],
  sizeChartImage: [],
  inventories: [{ quantity: "", mrpPrice: "" }], // initial entry
  featured: false,
  videoUrl: "",
  // new item
  materials: [{ name: "" }],
  fabrics: [{ colorCode: "", colorName: "", images: [] }],
  colors: [{ colorName: "", images: [] }],
  sizes: [{ sizeName: "", images: [] }],
  set: [{ setName: "", images: [] }],
};

export const discountTypes = [
  { name: "Flat", key: "flat" },
  { name: "Percentage", key: "percent" },
];

export const inventoryTypes = [
  // { name: "Color", key: "colorInventory" },
  // { name: "Size", key: "levelInventory" },
  // { name: "Color - Size", key: "colorLevelInventory" },
  { name: "Without Any", key: "inventory" },
];

export const CreateProductForm: React.FC = () => {
  const { toast } = useToast();
  const [imageFileList, setImageFileList] = React.useState([]);
  const [thumbnailFileList, setThumbnailFileList] = React.useState([]);
  const [backViewFileList, setBackViewFileList] = React.useState([]);
  const [sizeChartFileList, setSizeChartFileList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [brands, setBrands] = React.useState<TBrand[]>([]);
  const [categories, setCategories] = React.useState<TCategory[]>([]);
  const [subCategories, setSubCategories] = React.useState<TSubCategory[]>([]);
  const [childCategories, setChildCategories] = React.useState<
    TChildCategory[]
  >([]);
  // pabric
  const [fabricImageFileLists, setFabricImageFileLists] = React.useState<
    Record<number, any[]>
  >({});
  const [colorImageFileLists, setColorImageFileLists] = React.useState<
    Record<number, any[]>
  >({});
  const [sizeImageFileLists, setSizeImageFileLists] = React.useState<
    Record<number, any[]>
  >({});
  const [setImageFileLists, setSetImageFileLists] = React.useState<
    Record<number, any[]>
  >({});

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
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

  // Fabric
  const getDefaultFabric = () => ({
    colorCode: "#1677ff",
    colorName: "",
    images: [],
  });

  const selectedColor = form.watch("color");
  // console.log(selectedColor, "selected color..........");

  React.useEffect(() => {
    getAllCategory().then((data) => setCategories(data.data));
  }, []);

  React.useEffect(() => {
    getAllSubCategory().then((data) => setSubCategories(data.data));
  }, []);

  React.useEffect(() => {
    getAllChildCategory().then((data) => setChildCategories(data.data));
  }, []);

  React.useEffect(() => {
    getAllBrand().then((data) => setBrands(data.data));
  }, []);

  const filteredSubCategories = React.useMemo(() => {
    return subCategories.filter(
      (subCat) => subCat?.categoryRef?._id === selectedCategoryId
    );
  }, [subCategories, selectedCategoryId]);

  const filteredChildCategories = React.useMemo(() => {
    return childCategories.filter(
      (childCat) => childCat?.subCategoryRef?._id === selectedSubCategoryId
    );
  }, [subCategories, selectedSubCategoryId]);

  const handleImageFileChange = async ({ fileList }: any) => {
    setImageFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    const compressedFiles = await compressMultipleImages(rawFiles);

    // Sync with react-hook-form
    form.setValue("images", compressedFiles);
  };

  const handleThumbnailFileChange = async ({ fileList }: any) => {
    setThumbnailFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    const compressedFiles = await compressMultipleImages(rawFiles);

    // Sync with react-hook-form
    form.setValue("thumbnailImage", compressedFiles);
  };

  const handleBackViewFileChange = async ({ fileList }: any) => {
    setBackViewFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    const compressedFiles = await compressMultipleImages(rawFiles);

    // Sync with react-hook-form
    form.setValue("backViewImage", compressedFiles);
  };

  const handleSizeChartFileChange = async ({ fileList }: any) => {
    setSizeChartFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    const compressedFiles = await compressMultipleImages(rawFiles);

    // Sync with react-hook-form
    form.setValue("sizeChartImage", compressedFiles);
  };

  const handleFabricImageChange = async (index: number, { fileList }: any) => {
    // Update state for this specific fabric index
    setFabricImageFileLists((prev) => ({
      ...prev,
      [index]: fileList,
    }));

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    const compressedFiles = await compressMultipleImages(rawFiles);

    // Sync with react-hook-form
    form.setValue(`fabrics.${index}.images`, compressedFiles);
  };

  const handleColorImageChange = async (index: number, { fileList }: any) => {
    setColorImageFileLists((prev) => ({
      ...prev,
      [index]: fileList,
    }));
    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    const compressedFiles = await compressMultipleImages(rawFiles);

    form.setValue(`colors.${index}.images`, compressedFiles);
  };

  const handleSizeImageChange = async (index: number, { fileList }: any) => {
    setSizeImageFileLists((prev) => ({
      ...prev,
      [index]: fileList,
    }));
    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    const compressedFiles = await compressMultipleImages(rawFiles);

    form.setValue(`sizes.${index}.images`, compressedFiles);
  };

  const handleSetImageChange = async (index: number, { fileList }: any) => {
    setSetImageFileLists((prev) => ({
      ...prev,
      [index]: fileList,
    }));
    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    const compressedFiles = await compressMultipleImages(rawFiles);

    form.setValue(`set.${index}.images`, compressedFiles);
  };

  // console.log(fileList, "fileList................................");

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {

    setLoading(true);
    const formData = makeFormData(values);

    try {
      await createFormAction(formData);
      form.reset();
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      setImageFileList([]);
      setThumbnailFileList([]);
      setBackViewFileList([]);
      setSizeChartFileList([]);
      setFabricImageFileLists({});
      setColorImageFileLists({});
      setSizeImageFileLists({});
      setSetImageFileLists({});
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  //   function 
  const onError = (errors: any) => {
    console.log("❌ Form Validation Errors:", errors);
  };

  return (
    <Card className="m-6 mt-1 p-4 rounded-lg">
      <Label className="text-xl font-semibold mb-4">Create Product</Label>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="grid grid-cols-12 gap-2 py-2"
        >
          {/* Text Inputs */}
          <div className="col-span-10">
            <div className="grid grid-cols-2 gap-1">
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
                              <SelectItem key={index} value={String(item._id)}>
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
            </div>
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
              {/* <FormField
                control={form.control}
                name="freeShipping"
                render={({ field }) => (
                  <div className="flex items-end gap-2 w-full">
                    <FormItem className="flex-1">
                      <FormLabel>Free Shipping</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={String(field.value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select free shipping?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription className="text-red-400 text-xs min-h-4">
                        {form.formState.errors.freeShipping?.message}
                      </FormDescription>
                    </FormItem>
                  </div>
                )}
              /> */}
              {/* <FormField
                control={form.control}
                name="discountType"
                render={({ field }) => (
                  <div className="flex items-end gap-2 w-full">
                    <FormItem className="flex-1">
                      <FormLabel>Discount Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select discount type" />
                          </SelectTrigger>
                          <SelectContent>
                            {discountTypes.map((type) => (
                              <SelectItem
                                key={type.key}
                                value={String(type.key)}
                              >
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription className="text-red-400 text-xs min-h-4">
                        {form.formState.errors.discountType?.message}
                      </FormDescription>
                    </FormItem>
                  </div>
                )}
              /> */}

              {/* <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter discount amount" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.discount?.message}
                    </FormDescription>
                  </FormItem>
                )}
              /> */}

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
                              <SelectItem key={index} value={String(item._id)}>
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
                              <SelectItem key={index} value={String(item._id)}>
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
                              <SelectItem key={index} value={String(item._id)}>
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

              {/* Materials & Inventory Section - Side by Side */}
              <div className="col-span-3 grid grid-cols-3 gap-2">
                {/* Material */}
                {/* Material */}
                <div className="my-4 border p-4 border-gray-300 rounded-md">
                  <div className="mb-4">
                    <FormLabel>Materials</FormLabel>
                  </div>
                  {materialFields.map((field, index) => (
                    <div
                      key={field.id}
                      className=" mb-2 rounded-md relative"
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

            </div>

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
                <FormItem className="flex items-center gap-2 mt-2">
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

            <Button type="submit" loading={loading} className="my-6">
              Create
            </Button>
          </div>

          {/* Image */}
          <div className="col-span-2 min-h-[500px] grid grid-cols-2">
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
            </div>{" "}
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
                      onChange={handleImageFileChange}
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
          </div>
        </form>
      </Form>
    </Card>
  );
};
