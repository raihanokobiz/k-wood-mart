import { File } from "buffer";

export type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
};

export type UploadedFile = {
  buffer: Buffer;
  originalname: string;
  fieldname: string;
  mimetype: string;
};

export type TUser = {
  userId?: string;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  image?: string;
  address?: string;
  city?: string;
  state?: string;
  roleRef?: string;
  role?: string;
  warehouseRef?: string | null;
  warehouse?: string | null;
  isFistOrder?: boolean;
  orderPlaced?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TBanner = {
  _id?: string;
  image?: string;
  files?: File[];
  title?: string;
  details?: string;
  bannerCategory?: string;
  type?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  link: string;
};

export type TBrand = {
  _id?: string;
  image?: string;
  name?: string;
  slug?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TOrder = {
  _id?: string;
  warehouseRef?: string;
  orderId: string;
  subTotalPrice?: number;
  shippingCost?: number;
  couponDiscount?: number;
  paymentRef?: string[];
  totalPrice?: number;
  discount?: number;
  products?: OrderProducts[];
  status?: string;
  isGuestUser?: boolean;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerCity?: string;
  customerAddress?: string;
  customerAltPhone?: string;
  guestUserRef?: string;
  userRef?: TUser;
  couponRef?: TCoupon;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  isCourierSend?: boolean;
};

export type TPagination = {
  currentPage: number;
  currentPageLimit: number;
  total: number;
  totalPage: number;
  prevPage: number | null;
  prevPageLimit: number;
  nextPage: number | null;
  nextPageLimit: number;
};

export type TCategory = {
  _id: string;
  name: string;
  image: string;
  vectorImage: string;
  slug: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type AllCategoryResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TCategory[];
};

export type AllBrandResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TBrand[];
};

export type AllSubCategoryResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TSubCategory[];
};

export type AllChildCategoryResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TChildCategory[];
};

export type AllCategoryWithPaginationResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: {
    result: TCategory[];
    pagination: {
      currentPage: number;
      currentPageLimit: number;
      total: number;
      totalPage: number;
      prevPage: number | null;
      prevPageLimit: number;
      nextPage: number | null;
      nextPageLimit: number;
    };
  };
};

export type AllBrandWithPaginationResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: {
    result: TBrand[];
    pagination: {
      currentPage: number;
      currentPageLimit: number;
      total: number;
      totalPage: number;
      prevPage: number | null;
      prevPageLimit: number;
      nextPage: number | null;
      nextPageLimit: number;
    };
  };
};

export type AllSubCategoryWithPaginationResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: {
    result: TSubCategory[];
    pagination: {
      currentPage: number;
      currentPageLimit: number;
      total: number;
      totalPage: number;
      prevPage: number | null;
      prevPageLimit: number;
      nextPage: number | null;
      nextPageLimit: number;
    };
  };
};

export type AllChildCategoryWithPaginationResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: {
    result: TChildCategory[];
    pagination: {
      currentPage: number;
      currentPageLimit: number;
      total: number;
      totalPage: number;
      prevPage: number | null;
      prevPageLimit: number;
      nextPage: number | null;
      nextPageLimit: number;
    };
  };
};

export type SingleCategoryResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TCategory;
};

export type SingleBrandResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TBrand;
};

export type SingleSubCategoryResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TSubCategory;
};

export type SingleChildCategoryResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TChildCategory;
};

export type TResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type OrderReport = {
  status: string;
  totalOrders: number;
  totalSubTotalPrice: number;
  totalProducts: number;
};

export type TInventory = {
  _id: string;
  quantity: number;
  barcode: string;
  availableQuantity: number;
  soldQuantity: number;
  holdQuantity: number;
  color: string;
  name: string;
  level: string;
  inventoryID: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  productRef: string;
  price: number;
  mrpPrice?: number;
};

export type TSubCategory = {
  _id: string;
  name: string;
  image: string;
  bannerImage?: string;
  viewType?: string;
  slug: string;
  status: boolean;
  categoryRef: TCategory;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TChildCategory = {
  _id: string;
  name: string;
  image: string;
  bannerImage?: string;
  viewType?: string;
  slug: string;
  status: boolean;
  subCategoryRef: TSubCategory;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TSubChildCategory = {
  _id: string;
  name: string;
  image: string;
  bannerImage?: string;
  slug: string;
  status: boolean;
  childCategoryRef: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TCoupon = {
  _id: string;
  code: string;
  discount: number;
  useLimit: number;
  used: number;
  startDate: string;
  expireDate: string;
  userInfo: string[];
  discountType: "brand" | "category" | "subCategory";
  brandRef?: string | null;
  categoryRef?: TCategory | null;
  subCategoryRef?: TSubCategory | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TProduct = {
  _id: string;
  productId: string;
  name: string;
  description?: string;
  discountType?: "flat" | "percent";
  discount?: number;
  discountAmount?: number;
  price: number;
  mrpPrice?: number;
  warehousePrice?: number;
  warehouseProfit?: number;
  wholesalePrice?: number;
  wholesaleProfit?: number;
  thumbnailImage: string;
  backViewImage?: string;
  images?: string[];
  sizeChartImage?: string;
  videoUrl?: string;
  status?: string;
  slug?: string;
  freeShipping: boolean;
  gender: string;
  mainInventory?: number;
  quantity?: number;
  inventoryType?:
    | "colorInventory"
    | "levelInventory"
    | "colorLevelInventory"
    | "inventory";
  inventoryRef?: TInventory[];
  brandRef?: TBrand;
  categoryRef?: TCategory;
  subCategoryRef?: TSubCategory;
  childCategoryRef?: TChildCategory;
  subChildCategoryRef?: TSubChildCategory | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface TBulkOrder {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  companyName?: string;
  productType?: string;
  deliveryDate?: Date | string | null;
  quantity?: number;
  description?: string;
}

export interface TCampaign {
  _id: string;
  name: string;
  couponRef: TCoupon;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type AllCouponResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TCoupon[];
};

export type AllBulkOrderResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TBulkOrder[];
};

export type AllCouponWithPaginationResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: {
    result: TCoupon[];
    pagination: {
      currentPage: number;
      currentPageLimit: number;
      total: number;
      totalPage: number;
      prevPage: number | null;
      prevPageLimit: number;
      nextPage: number | null;
      nextPageLimit: number;
    };
  };
};

export type AllBulkOrderWithPaginationResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: {
    result: TBulkOrder[];
    pagination: {
      currentPage: number;
      currentPageLimit: number;
      total: number;
      totalPage: number;
      prevPage: number | null;
      prevPageLimit: number;
      nextPage: number | null;
      nextPageLimit: number;
    };
  };
};

export interface AllCampaignResponse {
  statusCode: number;
  status: string;
  message: string;
  data: TCampaign[];
}

export interface AllCampaignWithPaginationResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    result: TCampaign[];
    pagination: {
      currentPage: number;
      currentPageLimit: number;
      total: number;
      totalPage: number;
      prevPage: number | null;
      prevPageLimit: number;
      nextPage: number | null;
      nextPageLimit: number;
    };
  };
}

export type SingleCouponResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TCoupon;
};

export type SignInResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: TUser;
  };
};

export interface SingleCampaignResponse {
  statusCode: number;
  status: string;
  message: string;
  data: TCampaign;
}

export type AllUserResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TUser[];
};

export type AllBannerResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TBanner[];
};

export type AllBannerWithPaginationResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: {
    result: TBanner[];
    pagination: TPagination;
  };
};

export type TContact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  __v: number;
};
export type AllContactWithPaginationResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: {
    result: TContact[];
    pagination: TPagination;
  };
};

export type SingleBannerResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TBanner;
};

export type AllProductResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TProduct[];
};

export type AllProductWithPaginationResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: {
    result: TProduct[];
    pagination: {
      currentPage: number;
      currentPageLimit: number;
      total: number;
      totalPage: number;
      prevPage: number | null;
      nextPage: number | null;
    };
  };
};
export type AllBlogWithPaginationResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: {
    result: TBlog[];
    pagination: {
      currentPage: number;
      currentPageLimit: number;
      total: number;
      totalPage: number;
      prevPage: number | null;
      nextPage: number | null;
    };
  };
};

export type SingleProductResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TProduct;
};
export type SingleBlogResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TProduct;
};

export interface AllOrderResponse {
  statusCode: number;
  status: string;
  message: string;
  data: TOrder[];
}

export interface SingleOrderResponse {
  statusCode: number;
  status: string;
  message: string;
  data: TOrder;
}

export interface AllOrderWithPaginationResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    result: TOrder[];
    pagination: TPagination;
  };
}

export interface SteadfastOrderPayload {
  invoice: string;
  recipient_name: string;
  recipient_phone: string; // Should be exactly 11 digits
  recipient_address: string;
  cod_amount: string | number; // Can be numeric or string depending on usage
  note?: string; // Optional field
}

export interface DashboardMetrics {
  totalOrders: number;
  totalSales: number;
  totalStock: number;
  totalStockValue: number;
}

export interface DashboardMetricsResponse {
  statusCode: number;
  status: string;
  message: string;
  data: DashboardMetrics;
}

export interface OrderProducts {
  productRef: TProduct;
  inventoryRef: TInventory;
  quantity: number;
  price: number;
}

export type TBlog = {
  _id?: string;
  image?: string;
  title?: string;
  author?: string;
  details?: string;
  slug?: string;
  tags: [];
  createdAt?: string;
  updatedAt?: string;
};
