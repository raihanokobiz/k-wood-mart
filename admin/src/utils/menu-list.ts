import { Group } from "@/types/shared";
import {
  Tag,
  Users,
  LayoutGrid,
  Printer,
  ShoppingBag,
  BadgeDollarSign,
  Globe,
  FileUp,
  FileDown,
  FolderTree,
  PackageX,
  UserCog,
  Settings,
  BriefcaseBusiness,
  ShoppingCart,
  Shapes,
  Package2,
  TicketPercent,
  FlameKindling,
  Images,
  ShoppingBasket,
} from "lucide-react";

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Management",
      menus: [
        {
          href: "/order-list",
          label: "Orders",
          active: pathname.includes("/order-list"),
          icon: ShoppingCart,
          submenus: [],
        },
        // {
        //   href: "/bulk-order-list",
        //   label: "Bulk Orders",
        //   active: pathname.includes("/bulk-order-list"),
        //   icon: ShoppingBasket,
        //   submenus: [],
        // },
        {
          href: "/brand",
          label: "Brand",
          active: pathname.includes("/brand"),
          icon: Tag,
          submenus: [],
        },
        {
          href: "/category",
          label: "Category",
          active: pathname.includes("/category"),
          icon: Shapes,
          submenus: [
            {
              href: "/category/category",
              label: "Category",
              active: pathname === "/category/category",
            },
            {
              href: "/category/subcategory",
              label: "Subcategory",
              active: pathname === "/category/subcategory",
            },
            {
              href: "/category/childcategory",
              label: "Childcategory",
              active: pathname === "/category/childcategory",
            },
          ],
        },
        {
          href: "/products",
          label: "Products",
          active: pathname.includes("/products"),
          icon: Package2,
          submenus: [],
        },
        {
          href: "/coupon",
          label: "Coupon",
          active: pathname.includes("/coupon"),
          icon: TicketPercent,
          submenus: [],
        },
        {
          href: "/campaign",
          label: "Campaign",
          active: pathname.includes("/campaign"),
          icon: FlameKindling,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Pages",
      menus: [
        {
          href: "/banners",
          label: "Banners",
          active: pathname.includes("/banners"),
          icon: Images,
          submenus: [],
        },
        {
          href: "/blogs",
          label: "Blogs",
          active: pathname.includes("/blogs"),
          icon: Images,
          submenus: [],
        },
        {
          href: "/contact",
          label: "Contacts",
          active: pathname.includes("/contact"),
          icon: Images,
          submenus: [],
        },
      ],
    },
    // {
    //   groupLabel: "Configuration",
    //   menus: [
    //     {
    //       href: "/staffs",
    //       label: "Staffs",
    //       active: pathname.includes("/staffs"),
    //       icon: UserCog,
    //       submenus: [],
    //     },
    //   ],
    // },
  ];
}
