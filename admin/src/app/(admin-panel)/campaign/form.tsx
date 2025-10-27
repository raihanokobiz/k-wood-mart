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
import { campaignFormSchema, dropZoneConfig } from "./form-schema";
import { FileUp, Paperclip } from "lucide-react";
import { humanFileSize, makeFormData } from "@/utils/helpers";
import { createFormAction } from "./actions";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Label } from "@/components/ui/label";
import { TCoupon } from "@/types/shared";
import { getAllCoupon } from "@/services/coupon";
import { useRouter } from "next/navigation";

const defaultValues = {
  name: "",
  couponRef: "",
};

export const CreateCampaignForm: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [coupons, setCoupons] = React.useState<TCoupon[]>([]);

  React.useEffect(() => {
    getAllCoupon().then((data) => setCoupons(data.data));
  }, []);

  const form = useForm<z.infer<typeof campaignFormSchema>>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof campaignFormSchema>) => {
    setLoading(true);
    const formData = makeFormData(values);
    // console.log(values, "values from form++++++++++++++++++++++++++");
    try {
      await createFormAction(formData);
      form.reset();
      toast({
        title: "Success",
        description: "Campaign created successfully",
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
      <Label className="text-xl font-semibold mb-4">Create Campaign</Label>
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
                  Campaign Title <b className="text-red-500">*</b>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter campaign name" {...field} />
                </FormControl>
                <FormDescription className="text-red-400 text-xs min-h-4">
                  {form.formState.errors.name?.message}
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="couponRef"
            render={({ field }) => (
              <div className="flex items-end gap-2 w-full">
                <FormItem className="flex-1">
                  <FormLabel>
                    Coupon <b className="text-red-500">*</b>
                  </FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign coupon" />
                      </SelectTrigger>
                      <SelectContent>
                        {coupons.map((coupon) => (
                          <SelectItem
                            key={coupon._id}
                            value={String(coupon._id)}
                          >
                            {coupon.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription className="text-red-400 text-xs min-h-4">
                    {form.formState.errors.couponRef?.message}
                  </FormDescription>
                </FormItem>
              </div>
            )}
          />
          <Button type="submit" loading={loading} className="mb-6">
            Create
          </Button>
        </form>
      </Form>
    </Card>
  );
};
