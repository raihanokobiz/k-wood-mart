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
import { subCategoryFormSchema, dropZoneConfig } from "./form-schema";
import { FileUp, Paperclip, Plus, Trash } from "lucide-react";
import { humanFileSize, makeFormData } from "@/utils/helpers";
import { createFormAction } from "./actions";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Label } from "@/components/ui/label";
import { TCategory, TChildCategory, TSubCategory } from "@/types/shared";
import { ColorPicker } from "antd";
import { getAllCategory } from "@/services/category";
import { getAllSubCategory } from "@/services/sub-category";
import { getAllChildCategory } from "@/services/child-category";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";

const defaultValues = {
  name: "",
  viewType: "",
  categoryRef: "",
  image: [],
  bannerImage: [],
};

export const viewTypes = [
  { name: "Top", key: "top" },
  { name: "Middle", key: "middle" },
  { name: "Lower Middle", key: "lowerMiddle" },
  { name: "Bottom", key: "buttom" },
];

export const CreateSubCategoryForm: React.FC = () => {
  const { toast } = useToast();
  const [imageFileList, setImageFileList] = React.useState([]);
  const [bannerFileList, setBannerFileList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState<TCategory[]>([]);
  const form = useForm<z.infer<typeof subCategoryFormSchema>>({
    resolver: zodResolver(subCategoryFormSchema),
    defaultValues,
  });

  const selectedCategoryId = form.watch("categoryRef");

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

  const onSubmit = async (values: z.infer<typeof subCategoryFormSchema>) => {
    setLoading(true);
    const formData = makeFormData(values);
    console.log(values, "values from form++++++++++++++++++++++++++");
    try {
      await createFormAction(formData);
      form.reset();
      toast({
        title: "Success",
        description: "SubCategory created successfully",
      });
      setImageFileList([]);
      setBannerFileList([]);
      window.location.reload();
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
      <Label className="text-xl font-semibold mb-4">Create SubCategory</Label>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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

            {/* remove view type here */}

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
                          <SelectValue placeholder="Select inventory type" />
                        </SelectTrigger>
                        <SelectContent>
                          {viewTypes.map((type) => (
                            <SelectItem key={type.key} value={String(type.key)}>
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

            <Button type="submit" loading={loading} className="mt-8">
              Create
            </Button>
          </div>

          {/* remove image Image */}
          {/* <div className="col-span-1 grid grid-cols-2">
            <div className="">
              <Label>
                Category Image <b className="text-red-500">*</b>
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
    </Card>
  );
};
