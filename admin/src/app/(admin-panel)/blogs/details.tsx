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
import { Select } from "antd";
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
import { FileUp, MoreHorizontal, Paperclip } from "lucide-react";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
// import { deleteblogAction, updateFormAction } from "./actions";
import { TBlog } from "@/types/shared";
import { confirmation } from "@/components/modals/confirm-modal";

import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, UploadFile } from "antd";
import { fileUrlGenerator, humanFileSize, makeFormData } from "@/utils/helpers";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import ReactQuill from "react-quill";
import { deleteBlogAction, updateFormAction } from "./actions";
import { getBlogFormSchema } from "./form-schema";

interface Props {
  blog: TBlog;
}

export const BlogDetailsSheet: React.FC<Props> = ({ blog }) => {
  const { toast } = useToast();
console.log("---------------blog-", blog)
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [fileList, setFileList] = React.useState<UploadFile<any>[]>([
    {
      uid: "-1",
      name: String(blog.image).split("/").pop() || "",
      status: "done",
      url: fileUrlGenerator(blog.image || ""),
    },
  ]);
  const [selectedImageUrl, setSelectedImageUrl] = React.useState(
    fileUrlGenerator(blog.image || "")
  );

  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("image", rawFiles);
  };

  // console.log(blog, "blog from colum detail");
  const blogFormSchema = getBlogFormSchema(true);
  const form = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: blog.title,
      details: blog.details,
      author: blog.author,
      tags: blog.tags,
      image: [],
    },
  });


  const [options, setOptions] = useState<{ value: string }[]>([]);

  const onSubmitUpdate = async (values: z.infer<typeof blogFormSchema>) => {
    setUpdating(true);
    const data = await makeFormData(values);
    try {
      await updateFormAction(String(blog._id), data);
      toast({
        title: "blog updated successfully",
      });
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to update blog",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };


  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this blog?")) {
      setDeleting(true);
      const deleted = await deleteBlogAction(String(blog._id));
      if (deleted) {
        toast({
          title: "blog deleted successfully",
        });
        setSheetOpen(false);
      }
    }
    setDeleting(false);
  };
  console.log("-------------", form.formState.errors);
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="sm:max-w-[750px] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>blog Details</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitUpdate)}
            className="grid grid-cols-2 gap-2 items-end py-2"
          >
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Blog Title <b className="text-red-500">*</b>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter blog Title" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.title?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Description</FormLabel>
                    <FormControl>
                      {/* <Input placeholder="Enter product description" {...field} /> */}
                      <ReactQuill {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.details?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Controller
                control={form.control}
                name="tags"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel>
                      Add tags <b className="text-red-500">*</b>
                    </FormLabel>
                    <FormControl>
                      <Select
                        mode="tags"
                        style={{ width: "100%" }}
                        placeholder="Enter or select tags"
                        value={value || []}
                        onChange={(newTags) => {
                          const newOptions = newTags
                            .filter(
                              (tag) => !options.some((opt) => opt.value === tag)
                            )
                            .map((tag) => ({ value: tag }));
                          setOptions((prev) => [...prev, ...newOptions]);
                          onChange(newTags);
                        }}
                        options={options}
                      />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.tags?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name" {...field} />
                    </FormControl>
                    {/* <FormDescription className="text-red-400 text-xs min-h-4">
                                  {form.formState.errors.name?.message}
                                </FormDescription> */}
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div>
                    <FormLabel>
                      Image <b className="text-red-500">*</b>
                    </FormLabel>
                    <Upload
                      listType="picture-card"
                      beforeUpload={() => false}
                      fileList={fileList}
                      onChange={handleFileChange}
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
                  (form.getValues("image") ?? []).length > 0 &&
                  (form.getValues("image") ?? []).map((file, i) => (
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
            {selectedImageUrl ? (
              <Image
                src={selectedImageUrl}
                alt="blog"
                height={350}
                width={350}
                className="w-full aspect-square object-cover rounded-md"
              />
            ) : (
              <p>No Image</p>
            )}

            <div className="m-4 flex gap-2">
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
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
