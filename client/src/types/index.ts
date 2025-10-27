export type TSubCategory = {
  _id: string;
  name: string;
  image: string;
  bannerImage: string;
  slug: string;
  status: boolean;
  categoryRef: string;
  createdAt: string;
  updatedAt: string;
  childCategories?: TChildCategory[];
  __v: number;
};

export type TMenuCategory = {
  name: string;
  slug: string;
  subCategories: TSubCategory[];
};

export type TMenuItem = TMenuCategory[];

export type TBanner = {
  _id: string;
  image: string;
  type: string;
  link: string;
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

export type TChildCategory = {
  [x: string]: any;
  _id: string;
  name: string;
  image: string;
  bannerImage: string;
  slug: string;
  status: boolean;
  subCategoryRef: string;
  createdAt: string;
};
export type TShopSideBar = {
  _id: string;
  name: string;
  image: string;
  colorCode: string;
  slug: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  subCategories: TSubCategory[];
  subChildCategories: TChildCategory;
};

export type TPrice = {
  minPrice: number;
  maxPrice: number;
};

export type TBrands = {
  _id: string;
  name: string;
  image: string;
  slug: string;
  status: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

export type TGender = "unisex" | "men" | "women";
export type TInventoryItem = {
  price: string;
  mrpPrice?: number;
};
export type TInventory = {
  price: string;
  mrpPrice?: number;
  level: string;
};

export type TInventoryRef = {
  _id: string;
  quantity: number;
  barcode: string;
  availableQuantity: number;
  soldQuantity: number;
  holdQuantity: number;
  color: string;
  name: string;
  price: string;
  mrpPrice: string;
  level: string;
  inventoryID: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  productRef: string;
};
export type TProduct = {
  brandRef?: TBrands;
  gender?: "unisex" | "men" | "women";
  priceRange?: TPrice;
  inventory: TInventory;
  cartDetails?: any;
  data?: any;
  result?: any;
  message?: string | undefined;
  _id: string;
  productId: string;
  name: string;
  description: string;
  discountType: "percent" | "flat" | string;
  discount: number;
  discountAmount: number;
  bannerImage?: string;
  price: number;
  mrpPrice: number;
  totalPrice?: number | undefined;
  warehousePrice: number;
  warehouseProfit: number;
  wholesalePrice: number;
  wholesaleProfit: number;
  thumbnailImage: string;
  backViewImage: string;
  sizeChartImage: string;
  images: string[];
  videoUrl: string;
  slug: string;
  freeShipping: boolean;

  mainInventory: number;
  inventoryType:
    | "colorInventory"
    | "levelInventory"
    | "colorLevelInventory"
    | string;
  inventoryRef: TInventoryRef[] | TInventoryRef;
  categoryRef: TCategory;
  subCategoryRef: TSubCategory;
  childCategoryRef: TChildCategory;
  createdAt: string;
  updatedAt: string;
  productRef?: string;
  quantity?: number;
  couponDiscount?: number;
  __v: number;
};

export type TBestSell = {
  data: {
    result: {
      products: TProduct[];
    };
  };
};

export type TResponse = {
  message: string;
  status: string;
  statusCode: number;
  data: any;
  filterOptions: TProduct[];
};

// export type TShopSideBarResponsive = {
//   result: TProduct[];
//   pagination: any;
//   filterOptions: {
//     brands: TBrands[];
//     categories: TCategory[];
//     subCategories: TSubCategory[];
//     childCategories: TChildCategory[];
//     priceRange: TPrice;
//     genders: TGender[];
//     size: string[];
//   };
// };

export interface TShopSideBarResponsive {
  // filterOptions: {
  brands: TBrand[];
  categories: TCategory[];
  genders: TGender;
  priceRange: TPrice;
  sizes: any[];
  // };
  // pagination: TPagination;
  // result: TProduct[];
}

export type TUser = {
  id: string;
  name: string;
  email: string;
  roleRef: string;
  role: string;
  warehouseRef: string | null;
  warehouse: string | null;
};

export type CartItem = {
  _id: string;
  cartId: string;
  quantity: number;
  product: TProduct;
  inventory: TInventoryRef;
  subtotal: number;
  productDiscount: number;
  savedAmount: number;
};

export type TCartDetails = {
  cartDetails: CartItem[];
  couponDiscount: number;
  productDiscount: number;
  totalPrice: number;
  totalSaved: number;
};

export type TReview = {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  status: boolean;
};

export type TPagination = {
  currentPage: number;
  currentPageLimit: number;
  total: number;
  totalPage: number;
  prevPage: number | null;
  nextPage: number | null;
};

export type TProductReviewsResponse = {
  status: "success" | "error";
  statusCode: number;
  message: string;
  data: {
    pagination: TPagination;
    result: TReview[];
  };
};

export type TCorrelation = {
  id: string;
  name: string;
  email: string;
  roleRef: string;
  role: string;
  warehouseRef: null;
  warehouse: null;
};

export type TCoupon = {
  code: string;
  discount: number;
  useLimit: number;
  used: number;
  startDate: string; // ISO date string
  expireDate: string; // ISO date string
  userInfo: TUser; // Update with specific type if known
  discountType: "category" | "product" | "all"; // assuming possible values
  categoryRef: string;
  _id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
};

export type TCampaign = {
  _id: string;
  name: string;
  couponRef: TCoupon;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TBrand = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TBrandResponse = {
  statusCode: number;
  status: string;
  message: string;
  data: TBrand[];
};
