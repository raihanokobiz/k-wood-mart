module.exports = {
  UserSchema: require("./auth/userSchema.js").UserSchema,
  AboutUsSchema: require("./about/aboutUsSchema.js").AboutUsSchema,
  BannerSchema: require("./banner/bannerSchema.js").BannerSchema,
  BrandSchema: require("./brand/brandSchema.js").BrandSchema,
  CategorySchema: require("./category/categorySchema.js").CategorySchema,
  SubCategorySchema: require("./subCategory/subCategorySchema.js")
    .SubCategorySchema,
  ChildCategorySchema: require("./childCategory/childCategorySchema.js")
    .ChildCategorySchema,
  SubChildCategorySchema:
    require("./subChildCategory/subChildCategorySchema.js")
      .SubChildCategorySchema,
  ContactInfoSchema: require("./contact/contactInfoSchema.js")
    .ContactInfoSchema,
  CouponSchema: require("./coupon/couponSchema.js").CouponSchema,
  InventorySchema: require("./inventory/inventorySchema.js").InventorySchema,
  OrderSchema: require("./order/orderSchema.js").OrderSchema,
  PolicySchema: require("./policy/policySchema.js").PolicySchema,
  ProductSchema: require("./product/productSchema.js").ProductSchema,
  NewsletterSchema: require("./newsletter/newsletterSchema.js")
    .NewsletterSchema,
  CartSchema: require("./cart/cartSchema.js").CartSchema,
  WishlistSchema: require("./wishlist/wishlistSchema.js").WishlistSchema,
  ProductReviewSchema: require("./productReview/productReviewSchema.js")
    .ProductReviewSchema,
  RoleSchema: require("./role/roleSchema.js").RoleSchema,
  ShippingMethodSchema: require("./shippingMethod/shippingMethodSchema.js")
    .ShippingMethodSchema,
  PaymentServiceConfigSchema:
    require("./paymentServiceConfig/paymentServiceConfigSchema.js")
      .PaymentServiceConfigSchema,
  WarehouseSchema: require("./warehouse/warehouseSchema.js").WarehouseSchema,
  WarehouseTransferSchema:
    require("./warehouseTransfer/warehouseTransferSchema.js")
      .WarehouseTransferSchema,
  PaymentSchema: require("./payment/paymentSchema.js").PaymentSchema,
  OrderBulkSchema: require("./orderBulk/orderBulkSchema.js").OrderBulkSchema,
  CampaignSchema: require("./campaign/campaignSchema.js").CampaignSchema,
  BlogSchema: require("./blog/blogSchema.js").BlogSchema,
  BlogTagSchema: require("./blogTag/blogTagSchema.js").BlogTagSchema,
};
