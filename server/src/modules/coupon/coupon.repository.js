const { CouponSchema, CartSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class CouponRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createCoupon(payload, session) {
    const newCoupon = await this.#model.create([payload], { session });
    return newCoupon;
  }

  async updateCoupon(id, payload) {
    const updatedCoupon = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedCoupon) {
      throw new Error("About Us not found");
    }
    return updatedCoupon;
  }

  async getCouponWithPagination(payload) {
    try {
      const coupons = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const coupons = await this.#model
            .find({})
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit)
            .populate([
              { path: "brandRef" },
              { path: "categoryRef" },
              { path: "subCategoryRef" },
            ]);
          // .populate('')
          const totalCoupon = await this.#model.countDocuments();

          return { doc: coupons, totalDoc: totalCoupon };
        }
      );

      return coupons;
    } catch (error) {
      console.error("Error getting coupons with pagination:", error);
      throw error;
    }
  }

  async calculateCouponTotal(payload) {
    try {
      const { userRef, couponRef } = payload;
      const cartItems = await CartSchema.find({ userRef: userRef }).populate(
        "productRef"
      );

      if (!cartItems || cartItems.length === 0) {
        throw new Error("Cart is empty.");
      }

      // 2. Calculate subtotal
      let subTotal = cartItems.reduce(
        (acc, item) =>
          acc +
          (item.productRef.price - item.productRef.discountAmount) *
            item.quantity,
        0
      );

      let discount = 0;
      let total = subTotal;

      if (couponRef) {
        // 3. Validate the coupon
        const coupon = await this.#model.findById(couponRef);
        if (!coupon) {
          throw new Error("Invalid coupon.");
        }

        // Check expiration
        const now = new Date();
        if (coupon.expireDate && now > coupon.expireDate) {
          throw new Error("Coupon expired.");
        }

        // Check usage limit
        if (coupon.used >= coupon.useLimit) {
          throw new Error("Coupon usage limit reached.");
        }

        const eligibleItems = cartItems.filter((item) => {
          if (coupon.discountType === "brand") {
            return (
              item.productRef.brandRef?.toString() ===
              coupon.brandRef?.toString()
            );
          } else if (coupon.discountType === "category") {
            return (
              item.productRef.categoryRef?.toString() ===
              coupon.categoryRef?.toString()
            );
          } else if (coupon.discountType === "subCategory") {
            return (
              item.productRef.subCategoryRef?.toString() ===
              coupon.subCategoryRef?.toString()
            );
          }
          return false;
        });

        const eligibleSubtotal = eligibleItems.reduce(
          (acc, item) =>
            acc +
            (item.productRef.price - item.productRef.discountAmount) *
              item.quantity,
          0
        );

        discount = Math.min(coupon.discount, eligibleSubtotal);

        // Update coupon usage
        await this.#model.findByIdAndUpdate(couponRef, { $inc: { used: 1 } });

        total = subTotal - discount;
      }

      // 5. Return response
      return {
        subTotal,
        discount,
        total,
        couponApplied: !!couponRef,
      };
    } catch (error) {
      console.error("Error calculating coupon total:", error);
      throw error;
    }
  }
}

module.exports = new CouponRepository(CouponSchema);
