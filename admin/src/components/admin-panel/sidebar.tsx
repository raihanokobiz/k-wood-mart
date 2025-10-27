"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { useStore } from "@/hooks/store/use-store";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin-panel/menu";
import { useSidebarToggle } from "@/hooks/store/use-sidebar-toggle";
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle";
import Image from "next/image";
// import { getSetting } from "@/services/settings";
import React from "react";
import { fileUrlGenerator } from "@/utils/helpers";
import logo from "@/assets/logo/main.png";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);
  // const [setting, setSetting] = React.useState<Settings>();

  // React.useEffect(() => {
  //   getSetting().then((data) => setSetting(data));
  // }, []);

  if (!sidebar) return null;
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-64"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2 border border-red-600 bg-[red]"
          >
            <span
              className={cn(
                "font-bold uppercase text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300 w-[100px] h-[100px] mt-8",
                sidebar?.isOpen === false
                  ? "-translate-x-96 opacity-0 hidden"
                  : "translate-x-0 opacity-100"
              )}
            >
              <Image
                src={logo}
                alt={String(brandName)}
                height={150}
                width={150}
                className="w-full h-full"
              />
            </span>
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
