"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import resetImage from "@/public/images/reset.jpg";
import Link from "next/link";
import { forgotPassword } from "@/services/auth";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const formSchema = z.object({ email: z.string().email() });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: { email: string }) => {
    setLoading(true);
    try {
      const response = await forgotPassword(values);

      if (response) {
        toast({ title: "Reset link sent", description: "Check your email" });
        form.reset();
        setTimeout(() => {
          router.push("/reset-password");
        }, 3000);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[350px] grid gap-6">
        <h1 className="text-3xl font-bold text-center">Forgot Password</h1>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Form {...form}>
            <div className="flex flex-col gap-4 justify-center items-center">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@email.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button loading={loading} type="submit" className="w-full">
                Send Reset Link
              </Button>
            </div>
          </Form>
        </form>
        <div>
          <Link
            className="hover:text-blue-500 hover:underline transition-all duration-500"
            href="/"
          >
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
