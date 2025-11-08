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
  inventoryType: "",
  images: [],
  thumbnailImage: [],
  backViewImage: [],
  sizeChartImage: [],
  inventories: [{ quantity: "", mrpPrice: "" }], // initial entry
  featured: false,
};

export const discountTypes = [
  { name: "Flat", key: "flat" },
  { name: "Percentage", key: "percent" },
];


export const inventoryTypes = [
  { name: "Color", key: "colorInventory" },
  { name: "Size", key: "levelInventory" },
  { name: "Color - Size", key: "colorLevelInventory" },
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

  const handleImageFileChange = ({ fileList }: any) => {
    setImageFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("images", rawFiles);
  };

  const handleThumbnailFileChange = ({ fileList }: any) => {
    setThumbnailFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("thumbnailImage", rawFiles);
  };

  const handleBackViewFileChange = ({ fileList }: any) => {
    setBackViewFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("backViewImage", rawFiles);
  };

  const handleSizeChartFileChange = ({ fileList }: any) => {
    setSizeChartFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("sizeChartImage", rawFiles);
  };
  // console.log(fileList, "fileList................................");

  const onSubmit = async (values: z.infer<typeof productFormSchema>) => {
    
    setLoading(true);
    const formData = makeFormData(values);
    console.log(values, "values from form++++++++++++++++++++++++++");
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

  return (
    <Card className="m-6 mt-1 p-4 rounded-lg">
      <Label className="text-xl font-semibold mb-4">Create Product</Label>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-3 gap-2 py-2"
        >
          {/* Text Inputs */}
          <div className="col-span-2">
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
                      <Input placeholder="Enter discount amount" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.discount?.message}
                    </FormDescription>
                  </FormItem>
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
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                              <ColorPicker
                                value={field.value || "#1677ff"}
                                showText
                                allowClear
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
                        )}
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
                          {formState.errors?.inventories?.[index]?.size?.message}
                        </FormDescription>
                      </FormItem>
                    )}

                  {selectedInventoryType !== "" && (
                    <>
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
              <Label>Backview Image (Max 1 File)</Label>
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
            {/* <div className="">
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
    </Card>
  );
};
