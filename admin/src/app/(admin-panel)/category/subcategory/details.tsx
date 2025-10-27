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
import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { deleteSubCategoryAction, updateFormAction } from "./actions";
import { TCategory, TChildCategory, TSubCategory } from "@/types/shared";
import { confirmation } from "@/components/modals/confirm-modal";
import { subCategoryFormSchema } from "./form-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColorPicker, Upload, UploadFile } from "antd";
import { fileUrlGenerator, humanFileSize, makeFormData } from "@/utils/helpers";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { getAllCategory } from "@/services/category";
import { getAllSubCategory } from "@/services/sub-category";
import { getAllChildCategory } from "@/services/child-category";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Label } from "@/components/ui/label";
import { upperCase, upperFirst } from "lodash";
import { viewTypes } from "./form";

interface Props {
  subCategory: TSubCategory;
}

export const SubCategoryDetailsSheet: React.FC<Props> = ({ subCategory }) => {
  console.log("subCategory from props:", subCategory);
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [imageFileList, setImageFileList] = React.useState<UploadFile<any>[]>([
    {
      uid: "-1",
      name: String(subCategory.image).split("/").pop() || "",
      status: "done",
      url: fileUrlGenerator(subCategory.image || ""),
    },
  ]);

  const [bannerFileList, setBannerFileList] = React.useState<UploadFile<any>[]>(
    [
      {
        uid: "-1",
        name: String(subCategory.bannerImage).split("/").pop() || "",
        status: "done",
        url: fileUrlGenerator(subCategory.bannerImage || ""),
      },
    ]
  );
  const [categories, setCategories] = React.useState<TCategory[]>([]);
  const form = useForm<z.infer<typeof subCategoryFormSchema>>({
    resolver: zodResolver(subCategoryFormSchema),
    defaultValues: {
      name: subCategory.name,
      viewType: subCategory.viewType || "",
      categoryRef: subCategory.categoryRef?._id,
      image: [],
      bannerImage: [],
    },
  });

  React.useEffect(() => {
    getAllCategory().then((data) => setCategories(data.data));
  }, []);

  const handleImageFileChange = ({ fileList }: any) => {
    setImageFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("image", rawFiles);
  };

  const handleBannerFileChange = ({ fileList }: any) => {
    setBannerFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("bannerImage", rawFiles);
  };

  const onSubmitUpdate = async (
    values: z.infer<typeof subCategoryFormSchema>
  ) => {
    setUpdating(true);
    const data = makeFormData(values);
    try {
      await updateFormAction(String(subCategory._id), data);
      toast({
        title: "SubCategory updated successfully",
      });
      setSheetOpen(false);
      setImageFileList([]);
      setBannerFileList([]);
    } catch (error: any) {
      toast({
        title: "Failed to update subCategory",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (
      await confirmation("Are you sure you want to delete this subCategory?")
    ) {
      setDeleting(true);
      console.log(subCategory._id, "subCategory id from han dle delete......");
      const deleted = await deleteSubCategoryAction(String(subCategory._id));
      if (deleted) {
        toast({
          title: "SubCategory deleted successfully",
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
          <SheetTitle>SubCategory Details</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitUpdate)}
            className="grid grid-cols-3 gap-2 py-2"
          >
            {/* Text Inputs */}
            <div className="col-span-2 grid grid-cols-3 justify-center items-start gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <b className="text-red-500">*</b>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter subCategory name" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.name?.message}
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
                        Category <b className="text-red-500">*</b>
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

              {/* <FormField
                control={form.control}
                name="viewType"
                render={({ field }) => (
                  <div className="flex items-end gap-2 w-full">
                    <FormItem className="flex-1">
                      <FormLabel>View Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select view type" />
                          </SelectTrigger>
                          <SelectContent>
                            {viewTypes.map((type) => (
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
                        {form.formState.errors.viewType?.message}
                      </FormDescription>
                    </FormItem>
                  </div>
                )}
              /> */}

              <div className="mx-4 mt-8 flex gap-2">
                <Button type="submit" variant="default" loading={updating}>
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
            {/* <div className="col-span-1 grid grid-cols-2">
              <div className="">
                <Label>
                  Image <b className="text-red-500">*</b>
                </Label>
                <FormField
                  control={form.control}
                  name="image"
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
                  {form.getValues("image") &&
                    form.getValues("image").length > 0 &&
                    form.getValues("image").map((file, i) => (
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
                  {form.formState.errors.image?.message}
                </div>
              </div>

              <div className="">
                <Label>
                  Banner Image <b className="text-red-500">*</b>
                </Label>
                <FormField
                  control={form.control}
                  name="bannerImage"
                  render={({ field }) => (
                    <div>
                      <Upload
                        listType="picture-card"
                        beforeUpload={() => false}
                        fileList={bannerFileList}
                        onChange={handleBannerFileChange}
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
                  {form.getValues("bannerImage") &&
                    form.getValues("bannerImage").length > 0 &&
                    form.getValues("bannerImage").map((file, i) => (
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
                  {form.formState.errors.bannerImage?.message}
                </div>
              </div>
            </div> */}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
