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
import { couponFormSchema } from "./form-schema";
import { FileUp, Paperclip } from "lucide-react";
import { humanFileSize, makeFormData } from "@/utils/helpers";
import { createFormAction } from "./actions";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Label } from "@/components/ui/label";
import { TCategory, TSubCategory } from "@/types/shared";
import { DatePicker } from "@/components/ui/date-picker";
import { getAllSubCategory } from "@/services/sub-category";
import { getAllCategory } from "@/services/category";
import { useRouter } from "next/navigation";

const defaultValues = {
  code: "",
  discount: "",
  useLimit: "",
  startDate: new Date(),
  expireDate: new Date(),
  discountType: "",
  categoryRef: "",
  brandRef: "",
  subCategoryRef: "",
};

export const couponTypes = [
  // { name: "Brand Wise", key: "brand" },
  { name: "Category  Wise", key: "category" },
  { name: "Subcategory Wise", key: "subCategory" },
];

export const CreateCouponForm: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = React.useState<TCategory[]>([]);
  const [subCategories, setSubCategories] = React.useState<TSubCategory[]>([]);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof couponFormSchema>>({
    resolver: zodResolver(couponFormSchema),
    defaultValues,
  });

  const selectedCouponType = form.watch("discountType");
  const selectedCategoryId = form.watch("categoryRef");

  React.useEffect(() => {
    getAllCategory().then((data) => setCategories(data.data));
  }, []);

  React.useEffect(() => {
    getAllSubCategory().then((data) => setSubCategories(data.data));
  }, []);

  const filteredSubCategories = React.useMemo(() => {
    return subCategories.filter(
      (subCat) => subCat.categoryRef._id === selectedCategoryId
    );
  }, [subCategories, selectedCategoryId]);

  const onSubmit = async (values: z.infer<typeof couponFormSchema>) => {
    setLoading(true);
    const cleanedData = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) =>
          !(
            (value === "" || value === undefined || value === null) &&
            ["brandRef", "categoryRef", "subCategoryRef"].includes(key)
          )
      )
    );
    const formData = makeFormData(cleanedData);
    // console.log(values, "values from form++++++++++++++++++++++++++");
    try {
      await createFormAction(formData);
      form.reset();
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
      <Label className="text-xl font-semibold mb-4">Create Coupon</Label>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-4 gap-2 items-end py-2"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Coupon Code <b className="text-red-500">*</b>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter coupon code" {...field} />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.code?.message}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount (Taka)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter coupon discount" {...field} />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.discount?.message}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="useLimit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Use Limit</FormLabel>
                <FormControl>
                  <Input placeholder="Enter useLimit number" {...field} />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.useLimit?.message}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  {/* <Input placeholder="Enter startDate number" {...field} /> */}
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => {
                      if (date) {
                        // Force the time to be consistent (e.g., noon UTC)
                        const adjustedDate = new Date(date);
                        adjustedDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
                        field.onChange(adjustedDate);
                      }
                    }}
                    placeholderText="From Date"
                    className="w-full"
                  />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.startDate?.message}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expireDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expire Date</FormLabel>
                <FormControl>
                  {/* <Input placeholder="Enter expireDate number" {...field} /> */}
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => {
                      if (date) {
                        // Force the time to be consistent (e.g., noon UTC)
                        const adjustedDate = new Date(date);
                        adjustedDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
                        field.onChange(adjustedDate);
                      }
                    }}
                    placeholderText="From Date"
                    className="w-full"
                  />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.expireDate?.message}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <div className="flex items-end gap-2 w-full">
                <FormItem className="flex-1">
                  <FormLabel>
                    Coupon Type <b className="text-red-500">*</b>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select coupon type" />
                      </SelectTrigger>
                      <SelectContent>
                        {couponTypes.map((type) => (
                          <SelectItem key={type.key} value={String(type.key)}>
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
          {selectedCouponType === "category" && (
            <FormField
              control={form.control}
              name="categoryRef"
              render={({ field }) => (
                <div className="flex items-end gap-2 w-full">
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
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
          )}

          {selectedCouponType === "subCategory" && (
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
                          {subCategories.map((item, index) => (
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
          )}

          <Button type="submit" loading={loading} className="mb-6">
            Create
          </Button>
        </form>
      </Form>
    </Card>
  );
};
