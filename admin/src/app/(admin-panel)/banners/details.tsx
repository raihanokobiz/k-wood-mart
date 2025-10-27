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
import { FileUp, MoreHorizontal, Paperclip } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { deleteBannerAction, updateFormAction } from "./actions";
import { TBanner } from "@/types/shared";
import { confirmation } from "@/components/modals/confirm-modal";
import { bannerFormSchema } from "./form-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bannerTypes } from "./form";
import { Upload, UploadFile } from "antd";
import { fileUrlGenerator, humanFileSize, makeFormData } from "@/utils/helpers";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";

interface Props {
  banner: TBanner;
}

export const BannerDetailsSheet: React.FC<Props> = ({ banner }) => {
  const { toast } = useToast();
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [fileList, setFileList] = React.useState<UploadFile<any>[]>([
    {
      uid: "-1",
      name: String(banner.image).split("/").pop() || "",
      status: "done",
      url: fileUrlGenerator(banner.image || ""),
    },
  ]);
  const [selectedImageUrl, setSelectedImageUrl] = React.useState(
    fileUrlGenerator(banner.image || "")
  );

  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("image", rawFiles);
  };

  // console.log(banner, "banner from colum detail");
  const form = useForm<z.infer<typeof bannerFormSchema>>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      link: banner.link,
      // details: banner.details,
      // bannerCategory: banner.bannerCategory,
      type: banner.type,
      image: [],
    },
  });

  const onSubmitUpdate = async (values: z.infer<typeof bannerFormSchema>) => {
    setUpdating(true);
    const data = await makeFormData(values);
    try {
      await updateFormAction(String(banner._id), data);
      toast({
        title: "Banner updated successfully",
      });
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to update banner",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this banner?")) {
      setDeleting(true);
      const deleted = await deleteBannerAction(String(banner._id));
      if (deleted) {
        toast({
          title: "Banner deleted successfully",
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
          <SheetTitle>Banner Details</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitUpdate)}
            className="grid grid-cols-2 gap-2 items-end py-2"
          >
            {/* <div className="col-span-2">
              {" "}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Banner Title <b className="text-red-500">*</b>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter banner title" {...field} />
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
                    <FormLabel>Banner Details</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter banner details" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.details?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            */}

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <div className="flex items-end gap-2 w-full">
                  <FormItem className="flex-1">
                    <FormLabel>
                      Banner Type <b className="text-red-500">*</b>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select banner type" />
                        </SelectTrigger>
                        <SelectContent>
                          {bannerTypes.map((type) => (
                            <SelectItem
                              key={type.key}
                              value={String(type.name)}
                            >
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs min-h-4">
                      {form.formState.errors.type?.message}
                    </FormDescription>
                  </FormItem>
                </div>
              )}
            />
             <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter link number"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-red-400 text-xs min-h-4">
                    {form.formState.errors.link?.message}
                  </FormDescription>
                </FormItem>
              )}
            />

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

            {selectedImageUrl ? (
              <Image
                src={selectedImageUrl}
                alt={banner.title || ""}
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
