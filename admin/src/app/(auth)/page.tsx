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
import { fileUrlGenerator, makeFormData } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "./action";
// import { useStore } from "@/hooks/store/use-store";
// import { useBranch } from "@/hooks/store/use-branch";
import Image from "next/image";
import logo from "@/assets/logo/main.png";
import { Eye, EyeOff } from "lucide-react";
import { saveAuthData } from "@/utils/auth";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // const data = makeFormData(values);
    setLoading(true);
    try {
      const loggedIn = await loginUser(values);
      const { accessToken, refreshToken, user } = loggedIn.data.data;
      // console.log(loggedIn, "logged in from page?????????????");
      // console.log(
      //   { accessToken: accessToken, refreshToken: refreshToken, user: user },
      //   "data from login....."
      // );

      if (loggedIn.success) {
        saveAuthData(loggedIn.data.data);

        toast({
          title: "Logged in Successfully!",
          variant: "default",
        });

        router.push("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Authentication Failed!",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-screen grid grid-cols-2 p-10 relative bg-secondary">
      <div className="m-auto grid w-[400px] h-[500px] gap-6 bg-white/30 backdrop-blur-lg shadow-xl p-8 rounded-xl">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-sm text-gray-400 text-muted-foreground">
            Enter your registered email and password to login.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <Form {...form}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@email.com" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs">
                      {form.formState.errors.email?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      {/* <Input type="password" placeholder="******" {...field} /> */}
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="******"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2 text-gray-500"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs">
                      {form.formState.errors.password?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button loading={loading} type="submit" className="w-full">
                Login
              </Button>
            </Form>
          </div>
        </form>
        <div>
          <Link
            className="hover:text-blue-500 hover:underline transition-all duration-500"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
      </div>
      <div className="max-h-screen flex justify-center items-center">
        <Image
          src={logo}
          alt="Login to NoHasan"
          // height={1600}
          // width={800}
          quality={100}
          className="w-1/2"
        />
      </div>
    </div>
  );
}
