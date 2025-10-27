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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MoreHorizontal,
  Upload as LucideUpload,
  Paperclip,
  FileUp,
} from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { deleteAction, updateFormAction } from "./actions";
import { TCategory, TCoupon } from "@/types/shared";
import { confirmation } from "@/components/modals/confirm-modal";
import { BASE_URL } from "@/config/config";
import { Upload, UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { fileUrlGenerator, humanFileSize, makeFormData } from "@/utils/helpers";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { getFormSchema } from "./form-schema";

interface Props {
  item: TCategory;
}

export const DetailsSheet: React.FC<Props> = ({ item }) => {
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const [imageFileList, setImageFileList] = React.useState<UploadFile<any>[]>([
    {
      uid: "-1",
      name: String(item.image).split("/").pop() || "",
      status: "done",
      url: fileUrlGenerator(item.image),
    },
  ]);
  const [vectorFileList, setVectorFileList] = React.useState<UploadFile<any>[]>(
    [
      {
        uid: "-1",
        name: String(item.vectorImage).split("/").pop() || "",
        status: "done",
        url: fileUrlGenerator(item.vectorImage),
      },
    ]
  );

  const [selectedImageUrl, setSelectedImageUrl] = React.useState(
    fileUrlGenerator(item.image)
  );
  const [selectedVectorImageUrl, setSelectedVectorImageUrl] = React.useState(
    item.vectorImage ? fileUrlGenerator(item.vectorImage) : ""
  );
const formSchema = getFormSchema(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      image: [],
      vectorImage: [],
    },
  });

  const handleImageFileChange = ({ fileList }: any) => {
    setImageFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("image", rawFiles);
  };

  const handleBannerFileChange = ({ fileList }: any) => {
    setVectorFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("vectorImage", rawFiles);
  };

  const onSubmitUpdate = async (values: z.infer<typeof formSchema>) => {
    setUpdating(true);
    console.log("values==========", values);
    const data = await makeFormData(values);
    try {
      await updateFormAction(String(item._id), data);
      toast({
        title: "Coupon updated successfully",
      });
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to update item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this item?")) {
      setDeleting(true);
      const deleted = await deleteAction(String(item._id));
      if (deleted) {
        toast({
          title: "Coupon deleted successfully",
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
        className="sm:max-w-[750px] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Category Details</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitUpdate)}
            className="grid grid-cols-2 gap-4 items-end py-4"
          >
            {/* Name Field */}
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Category Name <b className="text-red-500">*</b>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.name?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* Image */}
            <div className="col-span-1 grid grid-cols-2">
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

              <div className="">
                <Label>
                  Vector Image <b className="text-red-500">*</b>
                </Label>
                <FormField
                  control={form.control}
                  name="vectorImage"
                  render={({ field }) => (
                    <div>
                      <Upload
                        listType="picture-card"
                        beforeUpload={() => false}
                        fileList={vectorFileList}
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
                  {form.getValues("vectorImage") &&
                    (form.getValues("vectorImage") ?? []).length > 0 &&
                    (form.getValues("vectorImage") ?? []).map((file, i) => (
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
                  {form.formState.errors.vectorImage?.message}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-span-2 flex gap-3 mt-4">
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
