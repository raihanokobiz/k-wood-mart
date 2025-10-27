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
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Label } from "@/components/ui/label";
import { makeFormData } from "@/utils/helpers";
import { createFormAction } from "./actions";
import { useRouter } from "next/navigation";
import { getFormSchema } from "./form-schema";

const defaultValues = {
  name: "",
  image: [],
  vectorImage: [],
};

export const CreateForm: React.FC = () => {
  const { toast } = useToast();
  const [fileList, setFileList] = React.useState([]);
  const [vectorFileList, setVectorFileList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
const formSchema = getFormSchema(false);
  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema(false)),
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleImageFileChange = ({ fileList }: any) => {
    const latestFileList = fileList.slice(-1); // only keep the last uploaded
    setFileList(latestFileList);

    const rawFiles = latestFileList
      .map((f: any) => f.originFileObj)
      .filter(Boolean);
    form.setValue("image", rawFiles);
  };

  const handleVectorFileChange = ({ fileList }: any) => {
    const latestFileList = fileList.slice(-1); // only keep the last uploaded
    setVectorFileList(latestFileList);

    const rawFiles = latestFileList
      .map((f: any) => f.originFileObj)
      .filter(Boolean);
    form.setValue("vectorImage", rawFiles);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const formData = makeFormData(values);
    try {
      await createFormAction(formData);
      form.reset();
      setFileList([]);
      setVectorFileList([]);
      toast({
        title: "Success",
        description: "Coupon created successfully",
      });
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
      <Label className="text-xl font-semibold mb-4">Create Category</Label>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="py-2">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
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

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Image <b className="text-red-500">*</b>
                  </FormLabel>
                  <Upload
                    listType="picture-card"
                    beforeUpload={() => false}
                    fileList={fileList}
                    onChange={handleImageFileChange}
                    maxCount={1}
                  >
                    {fileList.length < 1 && (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload Image</div>
                      </div>
                    )}
                  </Upload>
                </FormItem>
              )}
            />

            {/* Vector Image Upload */}
            <FormField
              control={form.control}
              name="vectorImage"
              render={() => (
                <FormItem className="flex-1">
                  <FormLabel>
                    Vector Image <b className="text-red-500">*</b>
                  </FormLabel>
                  <Upload
                    listType="picture-card"
                    beforeUpload={() => false}
                    fileList={vectorFileList}
                    onChange={handleVectorFileChange}
                    maxCount={1}
                  >
                    {vectorFileList.length < 1 && (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload Vector</div>
                      </div>
                    )}
                  </Upload>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};
