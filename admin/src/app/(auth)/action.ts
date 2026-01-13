"use server";

// import { signIn } from "@/lib/next-auth";
import { logger } from "@/lib/winston";
import { SignInUser } from "@/services/auth";
import { TUser } from "@/types/shared";

export const loginUser = async (values: TUser) => {
  const { email, password } = values;
  console.log(email, password, ":user from login form action");

  try {
    const res = await SignInUser(values);
    return { success: true, data: res };
  } catch (error: any) {
    logger.error(error);

    throw new Error(error.message);
  }
};
