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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { bannerFormSchema } from "./form-schema";
import { FileUp, Paperclip } from "lucide-react";
import { humanFileSize, makeFormData } from "@/utils/helpers";
import { createFormAction } from "./actions";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Label } from "@/components/ui/label";

const defaultValues = {
  // title: "",
  // details: "",
  // bannerCategory: "",
  type: "MAIN BANNER",
  // status: "",
  // image: [],
};

export const bannerTypes = [
  { name: "MAIN BANNER", key: "main_banner" },
  // { name: "UPCOMING BANNER", key: "upcoming_banner" },
  // { name: "CATEGORY BANNER", key: "category_banner" },
  // { name: "BEST SALE BANNER", key: "best_sale_banner" },
  // { name: "NEWSLETTER BANNER", key: "newsletter_banner" },
  // { name: "SHOP BANNER", key: "shop_banner" },
  // { name: "PROMO BANNER", key: "promo_banner" },
];

export const CreateBannerForm: React.FC = () => {
  const { toast } = useToast();
  const [fileList, setFileList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);

    const rawFiles = fileList
      .map((file: any) => file.originFileObj)
      .filter(Boolean);

    // Sync with react-hook-form
    form.setValue("image", rawFiles);
  };
  // console.log(fileList, "fileList................................");

  const form = useForm<z.infer<typeof bannerFormSchema>>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues,
  });
  console.log("form", form);
  console.log("form", form.formState);
  console.log("form", form.formState.errors);

  const onSubmit = async (values: z.infer<typeof bannerFormSchema>) => {
    setLoading(true);
    const formData = makeFormData(values);
    // console.log(values, "values from form++++++++++++++++++++++++++");
    try {
      await createFormAction(formData);
      form.reset();
      toast({
        title: "Success",
        description: "Banner created successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setFileList([]);
    }
  };

  return (
    <Card className="m-6 mt-1 p-4 rounded-lg">
      <Label className="text-xl font-semibold mb-4">Create Banner</Label>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-4 gap-2 items-end py-2"
        >

          {/* <FormField
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
          <FormField
            control={form.control}
            name="bannerCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter bannerCategory number" {...field} />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.bannerCategory?.message}
                </FormDescription>
              </FormItem>
            )}
          /> */}

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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select banner type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bannerTypes.map((type) => (
                          <SelectItem key={type.key} value={String(type.name)}>
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
                <FormLabel>
                  Banner Link 
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter banner link" {...field} />
                </FormControl>
                 <FormDescription className="text-red-400 text-xs min-h-4">
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

          <Button type="submit" loading={loading} className="mb-6">
            Create
          </Button>
        </form>
      </Form>
    </Card>
  );
};
