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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { brandFormSchema, dropZoneConfig } from "./form-schema";
import { FileUp, Paperclip } from "lucide-react";
import { humanFileSize, makeFormData } from "@/utils/helpers";
import { createFormAction } from "./actions";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Label } from "@/components/ui/label";

const defaultValues = {
  name: "",
  image: [],
};

export const CreateBrandForm: React.FC = () => {
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

  const form = useForm<z.infer<typeof brandFormSchema>>({
    resolver: zodResolver(brandFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof brandFormSchema>) => {
    setLoading(true);
    const formData = makeFormData(values);
    // console.log(values, "values from form++++++++++++++++++++++++++");
    try {
      await createFormAction(formData);
      form.reset();
      toast({
        title: "Success",
        description: "Brand created successfully",
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
      <Label className="text-xl font-semibold mb-4">Create Brand</Label>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-4 gap-2 items-end py-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Brand Title <b className="text-red-500">*</b>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand name" {...field} />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.name?.message}
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
