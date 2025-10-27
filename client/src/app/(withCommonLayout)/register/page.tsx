"use client";

import NavBar from "@/components/pages/header/NavBar/NavBar";
import { getUser, registrationUser } from "@/services/auth";
import { getCartProducts } from "@/services/cart";
import { TResponse } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { VscEyeClosed, VscEye } from "react-icons/vsc";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>();

  const password = watch("password");

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = (await registrationUser({
        name: data.name,
        email: data.email,
        phone: String(data.phone),
        password: data.password,
      })) as TResponse;

      if (res?.status !== "error") {
        toast.success("Registration successful");
        router.push("/login");
        return;
      } else {
        toast.error(res?.message || "Registration failed. Please try again.");
      }

      reset();
    } catch (error: any) {
      const errorMessage =
        error.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [productsByUser, setProductsByUser] = useState<TResponse | null>(null);

  const coupon = "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser();
        const userId = user?.id;
        const data = await getCartProducts(userId, coupon);
        setProductsByUser(data || []);
      } catch (error) {
        console.error("Error fetching user or cart:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <NavBar userCartProducts={productsByUser?.data} />
      <div className="flex flex-col justify-center items-center py-20 lg:mt-0 mt-14">
        <div className="w-[350px] lg:w-[600px]">
          <div className="border-b-1 border-black/20 text-center pb-3 mb-5">
            <h2 className="text-3xl font-bold">Registration</h2>
          </div>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Name */}
            <div className="flex flex-col">
              <label htmlFor="name" className="pb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Name"
                autoFocus
                className="border border-black/20 p-1.5 rounded focus:border-black focus:outline-none"
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="pb-2">
                E-Mail Address (Optional)
              </label>
              <input
                type="email"
                placeholder="Email"
                className="border border-black/20 p-1.5 rounded focus:border-black focus:outline-none"
                {...register("email")}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label htmlFor="phone" className="pb-2">
                Mobile Phone
              </label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                className="border border-black/20 p-1.5 rounded focus:border-black focus:outline-none"
                {...register("phone", { required: "Phone is required" })}
              />
              {errors.phone && (
                <span className="text-red-500">{errors.phone.message}</span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className="pb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="border border-black/20 p-1.5 rounded w-full pr-10 focus:border-black focus:outline-none"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? (
                    <VscEye size={20} />
                  ) : (
                    <VscEyeClosed size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="pb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="border border-black/20 p-1.5 rounded w-full pr-10 focus:border-black focus:outline-none"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                >
                  {showConfirmPassword ? (
                    <VscEye size={20} />
                  ) : (
                    <VscEyeClosed size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#D4A373] hover:bg-[#CCD5AE] duration-300 text-white font-bold py-1.5 rounded-md cursor-pointer ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Login link */}
          <div className="flex justify-center gap-2 mt-4 text-md">
            <div className="mt-2 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-[#D4A373] hover:underline">
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Toast messages */}
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default Registration;
