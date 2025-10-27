"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { signOut } from "next-auth/react";
import { logout } from "@/utils/auth";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      logout();
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Logout Failed!",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return { loading, handleLogout };
};
