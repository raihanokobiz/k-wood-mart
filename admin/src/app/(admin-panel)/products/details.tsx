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
import React, { useEffect } from "react";
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { discountTypes, genderEnums, inventoryTypes } from "./form";
import { Label } from "@/components/ui/label";
import { upperCase, upperFirst } from "lodash";
import { getAllBrand } from "@/services/brand";

interface Props {
  product: TProduct;
}

export const ProductDetailsSheet: React.FC<Props> = ({ product }) => {
  console.log(
    "product from props 1111111111111111111111111111111111111111111",
    product
  );
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [imageFileList, setImageFileList] = React.useState<UploadFile<any>[]>(
    product.images?.map((item, index) => ({
      uid: `-${index + 1}`,
      name: String(item).split("/").pop() || `image-${index + 1}`,
      status: "done",
      url: fileUrlGenerator(item),
    })) || []
  );

  const imagesDemo = product.images?.map((data) => {});
  // console.log(
  //   imagesDemo,
  //   "mapped images from product details 22222222222222222222222222222"
  // );

  // console.log(imageFileList, "image filelist from details 3333333333333333333");

  const [thumbnailFileList, setThumbnailFileList] = React.useState<
    UploadFile<any>[]
  >([
    {
      uid: "-1",
      name: String(product.thumbnailImage).split("/").pop() || "",
      status: "done",
      url: fileUrlGenerator(product.thumbnailImage || ""),
    },
  ]);
  // console.log(
  //   thumbnailFileList,
  //   "thumbnail file list from details 44444444444444444444444"
  // );

  const [backViewFileList, setBackViewFileList] = React.useState<
    UploadFile<any>[]
  >([
    {
      uid: "-1",
      name: String(product.backViewImage).split("/").pop() || "",
      status: "done",
      url: fileUrlGenerator(product.backViewImage || ""),
    },
  ]);

  const [sizeChartFileList, setSizeChartFileList] = React.useState<
    UploadFile<any>[]
  >([
    {
      uid: "-1",
      name: String(product.sizeChartImage).split("/").pop() || "",
      status: "done",
      url: fileUrlGenerator(product.sizeChartImage || ""),
    },
  ]);

  const [brands, setBrands] = React.useState<TBrand[]>([]);
  const [categories, setCategories] = React.useState<TCategory[]>([]);
  const [subCategories, setSubCategories] = React.useState<TSubCategory[]>([]);
  const [childCategories, setChildCategories] = React.useState<
    TChildCategory[]
  >([]);
  console.log(
    "product from props 3333333333333333333333333333333333333333333333333333",
    product
  );
  // const form = useForm<z.infer<typeof productFormSchema>>({
  //   resolver: zodResolver(productFormSchema),
  //   defaultValues: {
  //     name: product.name,
  //     description: product.description,
  //     gender: product.gender,
  //     discountType: product.discountType || "",
  //     discount: String(product.discount) || "",
  //     // mrpPrice: String(product.mrpPrice),
  //     freeShipping: String(product.freeShipping),
  //     brandRef: product.brandRef?._id,
  //     categoryRef: product.categoryRef?._id,
  //     subCategoryRef: product.subCategoryRef?._id,
  //     childCategoryRef: product.childCategoryRef?._id,
  //     inventoryType: product.inventoryType,
  //     images: [],
  //     thumbnailImage: [],
  //     backViewImage: [],
  //     sizeChartImage: [],
  //     inventories: product.inventoryRef?.length
  //       ? product.inventoryRef.map((item: any) => ({
  //           quantity: String(item.quantity),
  //           ...(item._id && { id: item._id || '' }),
  //           ...(item.color && { color: item.color }),
  //           ...(item.name && { colorName: upperFirst(item.name) }),
  //           ...(item.level && { size: upperCase(item.level) }),
  //           ...(item.price && { price: upperCase(item.price) }),
  //           ...(item.mrpPrice && { mrpPrice: upperCase(item.mrpPrice) }),
  //         }))
  //       : [{ quantity: product.mainInventory }],
  //   },
  // });

  // ✅ Step 1: Top-level এ useForm call করুন
const form = useForm<z.infer<typeof productFormSchema>>({
  resolver: zodResolver(productFormSchema),
  defaultValues: {
    name: "",
    description: "",
    gender: "",
    discountType: "",
    discount: "",
    freeShipping: "",
    brandRef: "",
    categoryRef: "",
    subCategoryRef: "",
    childCategoryRef: "",
    inventoryType: "",
    images: [],
    thumbnailImage: [],
    backViewImage: [],
    sizeChartImage: [],
    inventories: [{ quantity: "" }],
  },
});

// ✅ Step 2: Product আসলে form reset করুন
useEffect(() => {
  if (product) {
    form.reset({
      name: product.name,
      description: product.description,
      gender: product.gender,
      discountType: product.discountType || "",
      discount: String(product.discount) || "",
      freeShipping: String(product.freeShipping),
      brandRef: product.brandRef?._id,
      categoryRef: product.categoryRef?._id,
      subCategoryRef: product.subCategoryRef?._id,
      childCategoryRef: product.childCategoryRef?._id,
      inventoryType: product.inventoryType,
      images: [],
      thumbnailImage: [],
      backViewImage: [],
      sizeChartImage: [],
      inventories: product.inventoryRef?.length
        ? product.inventoryRef.map((item: any) => ({
            quantity: String(item.quantity),
            ...(item._id && { id: item._id || '' }),
            ...(item.color && { color: item.color }),
            ...(item.name && { colorName: upperFirst(item.name) }),
            ...(item.level && { size: upperCase(item.level) }),
            ...(item.price && { price: upperCase(item.price) }),
            ...(item.mrpPrice && { mrpPrice: upperCase(item.mrpPrice) }),
          }))
        : [{ quantity: product.mainInventory }],
    });
  }
}, [product]);

  console.log("form values from product details 55555555555555555555555", form.getValues());

  const selectedCategoryId = form.watch("categoryRef");
  const selectedSubCategoryId = form.watch("subCategoryRef");

  const { control, register, watch, formState } = form;
  const selectedInventoryType = watch("inventoryType");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventories",
  });

  const getDefaultInventory = () => {
    const base = { id:"", quantity: "", mrpPrice: "" };
    if (selectedInventoryType === "colorInventory")
      return { ...base, id:"", color: "#1677ff", colorName: "" };
    if (selectedInventoryType === "levelInventory")
      return { ...base,id:"", size: "" };
    if (selectedInventoryType === "colorLevelInventory")
      return { ...base,id:"", color: "#1677ff", colorName: "", size: "" };
    return base;
  };

  const selectedColor = form.watch("color");

  React.useEffect(() => {
    getAllBrand().then((data) => setBrands(data.data));
  }, []);

  React.useEffect(() => {
    getAllCategory().then((data) => setCategories(data.data));
  }, []);

  React.useEffect(() => {
    getAllSubCategory().then((data) => setSubCategories(data.data));
  }, []);

  React.useEffect(() => {
    getAllChildCategory().then((data) => setChildCategories(data.data));
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

  React.useEffect(() => {
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

  const handleThumbnailFileChange = ({ fileList }: any) => {
    setThumbnailFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => {
        if (file.originFileObj) {
          return file.originFileObj;
        }
        return file.url;
      })
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("thumbnailImage", rawFiles);
  };

  const handleBackViewFileChange = ({ fileList }: any) => {
    setBackViewFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => {
        if (file.originFileObj) {
          return file.originFileObj;
        }
        return file.url;
      })
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("backViewImage", rawFiles);
  };

  const handleSizeChartFileChange = ({ fileList }: any) => {
    setSizeChartFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => {
        if (file.originFileObj) {
          return file.originFileObj;
        }
        return file.url;
      })
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("sizeChartImage", rawFiles);
  };

  const onSubmitUpdate = async (values: z.infer<typeof productFormSchema>) => {
    setUpdating(true);
    const data = makeFormData(values);
    console.log('data---', data)
    try {
      await updateFormAction(String(product._id), data);
      toast({
        title: "Product updated successfully",
      });
      setSheetOpen(false);
      setImageFileList([]);
      setThumbnailFileList([]);
      setBackViewFileList([]);
      setSizeChartFileList([]);
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
            className="grid grid-cols-3 gap-2 py-2"
          >
            {/* Text Inputs */}
            <div className="col-span-2">
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
                />

                <FormField
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
                            {/* <SelectTrigger>
                              <SelectValue placeholder="Select discount type ?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Yes</SelectItem>
                              <SelectItem value="false">No</SelectItem>
                            </SelectContent> */}
                          </Select>
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {form.formState.errors.discountType?.message}
                        </FormDescription>
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount</FormLabel>
                      <FormControl>
                        {/* <Input placeholder="Enter discount amount" {...field} /> */}
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormDescription className="text-red-400 text-xs min-h-4">
                        {form.formState.errors.discount?.message}
                      </FormDescription>
                    </FormItem>
                  )}
                />
                                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <div className="flex items-end gap-2 w-full">
                      <FormItem className="flex-1">
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              {genderEnums.map((type) => (
                                <SelectItem key={type.key} value={type.key}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {form.formState.errors.gender?.message}
                        </FormDescription>
                      </FormItem>
                    </div>
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
                <FormField
                  control={form.control}
                  name="inventoryType"
                  render={({ field }) => (
                    <div className="flex items-end gap-2 w-full">
                      <FormItem className="flex-1">
                        <FormLabel>
                          Inventory Type <b className="text-red-500">*</b>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select inventory type" />
                            </SelectTrigger>
                            <SelectContent>
                              {inventoryTypes.map((type) => (
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
                          {form.formState.errors.inventoryType?.message}
                        </FormDescription>
                      </FormItem>
                    </div>
                  )}
                />
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
    const [colorPickerOpen, setColorPickerOpen] = React.useState(false);
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
            getPopupContainer={(trigger) => trigger.parentNode as HTMLElement || document.body} // Prevents portal jumpiness
            onChange={(color) => field.onChange(color.toHexString())}
          />
        </FormControl>
        <FormDescription className="text-red-400 text-xs min-h-4">
          {
            formState.errors?.inventories?.[index]?.color?.message
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
                      <FormItem>
                        <FormLabel>
                          Quantity <b className="text-red-500">*</b>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter quantity"
                            {...register(`inventories.${index}.quantity`)}
                          />
                        </FormControl>
                        <FormDescription className="text-red-400 text-xs min-h-4">
                          {
                            formState.errors?.inventories?.[index]?.quantity
                              ?.message
                          }
                        </FormDescription>
                      </FormItem>
                      
                      {/* <FormLabel>
                        MRP (Maximum Retail Price){" "}
                        <b className="text-red-500">*</b>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter MRP price" {...field} />
                      </FormControl>
                      <FormDescription className="text-red-400 text-xs min-h-4">
                        {form.formState.errors.mrpPrice?.message}
                      </FormDescription> */}


                      <FormItem>
                      <FormLabel>
                        MRP (Maximum Retail Price){" "}
                        <b className="text-red-500">*</b>
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

              <div className="m-4 flex gap-2">
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
            <div className="col-span-1 min-h-[500px] grid grid-cols-2">
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
                <Label>Backview Image (Max 1 File) </Label>
                <FormField
                  control={form.control}
                  name="backViewImage"
                  render={({ field }) => (
                    <div>
                      <Upload
                        listType="picture-card"
                        beforeUpload={() => false}
                        fileList={backViewFileList}
                        onChange={handleBackViewFileChange}
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
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
