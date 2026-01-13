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
import { deleteCouponAction, updateFormAction } from "./actions";
import { TCategory, TCoupon, TSubCategory } from "@/types/shared";
import { confirmation } from "@/components/modals/confirm-modal";
import { couponFormSchema } from "./form-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { couponTypes } from "./form";
import { Upload } from "antd";
import { humanFileSize, makeFormData } from "@/utils/helpers";
import { UploadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { DatePicker } from "@/components/ui/date-picker";
import { getAllCategory } from "@/services/category";
import { getAllSubCategory } from "@/services/sub-category";

interface Props {
  coupon: TCoupon;
}

export const CouponDetailsSheet: React.FC<Props> = ({ coupon }) => {
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [fileList, setFileList] = React.useState([]);
  const [categories, setCategories] = React.useState<TCategory[]>([]);
  const [subCategories, setSubCategories] = React.useState<TSubCategory[]>([]);

  // console.log(coupon, "coupon from colum detail");
  const form = useForm<z.infer<typeof couponFormSchema>>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: coupon.code,
      discount: String(coupon.discount),
      useLimit: String(coupon.useLimit),
      startDate: new Date(coupon.startDate),
      expireDate: new Date(coupon.expireDate),
      discountType: coupon.discountType,
      categoryRef: coupon.categoryRef?._id,
      // brandRef: coupon.brandRef,
      subCategoryRef: coupon.subCategoryRef?._id,
    },
  });

  const selectedCouponType = form.watch("discountType");

  React.useEffect(() => {
    getAllCategory().then((data) => setCategories(data.data));
  }, []);

  React.useEffect(() => {
    getAllSubCategory().then((data) => setSubCategories(data.data));
  }, []);

  const onSubmitUpdate = async (values: z.infer<typeof couponFormSchema>) => {
    setUpdating(true);
    const cleanedData = Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) =>
          !(
            (value === "" || value === undefined || value === null) &&
            ["brandRef", "categoryRef", "subCategoryRef"].includes(key)
          )
      )
    );
    const data = makeFormData(cleanedData);
    try {
      await updateFormAction(String(coupon._id), data);
      toast({
        title: "Coupon updated successfully",
      });
      setSheetOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to update coupon",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    if (await confirmation("Are you sure you want to delete this coupon?")) {
      setDeleting(true);
      const deleted = await deleteCouponAction(String(coupon._id));
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
          <SheetTitle>Coupon Details</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitUpdate)}
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
                      onChange={field.onChange}
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
                      onChange={field.onChange}
                      placeholderText="Expire Date"
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
