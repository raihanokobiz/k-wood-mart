// const { CartSchema } = require("../../models/index.js");
const { CartSchema, CouponSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class CartRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createCart(payload, session) {
    const isObjectId = /^[a-f\d]{24}$/i.test(payload?.userRef);
    if (!isObjectId) {
      payload.correlationId = payload.userRef;
      delete payload.userRef
    }
    const newCart = await this.#model.create([payload], { session });
    return newCart;
  }

  async getAllCartByUser(payload) {
    const { userId, coupon , productRef, inventoryRef} = payload;
    const isObjectId = /^[a-f\d]{24}$/i.test(userId);
    const query = {};
    if (!isObjectId) {
      query.correlationId = userId;
    } else {
      query.userRef = userId;
    }
    if (productRef && inventoryRef) {
      query.productRef = productRef;
      query.inventoryRef = inventoryRef;
    }

    const carts = await this.#model
      .find(query)
      .populate("productRef")
      .populate("userRef")
      .populate("inventoryRef");

    let appliedCoupon = null;
    let message = `Viewing  carts`;
    console.log("carts -----------", carts[0]);
    console.log("carts -----------", carts[0]?.productRef?.inventoryRef);
    if (coupon) {
      const exitCoupon = await CouponSchema.findOne({ code: coupon });
      message = `Sorry that coupon isn’t valid.`;

      if (exitCoupon) {
        const now = new Date();
        if (now > exitCoupon.startDate && now < exitCoupon.expireDate && exitCoupon.useLimit >= exitCoupon.used) {
          appliedCoupon = exitCoupon;
          message = `Congratulations your coupon was applied successfully!`;
        }

      }
    }

    let totalPrice = 0;
    let totalSaved = 0;
    let totalCouponDiscount = 0;
    let productDiscount = 0;

    const cartDetails = carts.map((cart) => {
      const product = cart.productRef;
      const inventory = cart.inventoryRef;
      const quantity = cart.quantity;

      const price = inventory?.price || 0;
      const discountAmount = inventory?.discountAmount || 0;
console.log("price", price);
console.log("discountAmount", discountAmount);


      let couponDiscount = 0;

      // ✅ Apply coupon if it's applicable
      if (appliedCoupon) {
        if (
          (String(appliedCoupon?.categoryRef) === String(product?.categoryRef)) ||
          (String(appliedCoupon?.subCategoryRef) === String(product?.subCategoryRef)) ||
          (String(appliedCoupon?.childCategoryRef) === String(product?.childCategoryRef))
        ) {
          const discount = appliedCoupon.discount;

          couponDiscount =
            appliedCoupon.discountType === "percent"
              ? (price * discount) / 100
              : discount;

          couponDiscount = couponDiscount * quantity;
        }
      }

      const subtotal = price * quantity;
      const savedAmount = discountAmount * quantity + couponDiscount;

      totalPrice += subtotal - couponDiscount;
      productDiscount += discountAmount * quantity;
      totalCouponDiscount += couponDiscount;
      totalSaved += savedAmount;

      return {
        cartId: cart._id,
        quantity,
        product,
        inventory,
        subtotal,
        couponDiscount,
        savedAmount,
        productDiscount,
      };
    });

    return {
      data: {
        cartDetails,
        totalPrice,
        totalSaved,
        couponDiscount: totalCouponDiscount, // ✅ Total coupon discount outside
        productDiscount,
      },
      message,
    };
  }

  async findCartByUserAndProduct(query) {
    return await this.#model.findOne(query);
  }

  async updateCart(id, payload) {
    const updatedCart = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedCart) {
      throw new Error("About Us not found");
    }
    return updatedCart;
  }

  async updateCartQuantity(cartId, quantity) {
    return await this.#model.findByIdAndUpdate(
      cartId,
      { $set: { quantity } },
      { new: true } // Return the updated document
    );
  }

  async getCartWithPagination(payload) {
    try {
      const carts = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const carts = await this.#model
            .find({ userRef: payload.userId })
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit);
          // .populate('')
          // .populate('')
          const totalCart = await this.#model.countDocuments();

          return { doc: carts, totalDoc: totalCart };
        }
      );

      return carts;
    } catch (error) {
      console.error("Error getting carts with pagination:", error);
      throw error;
    }
  }
}

module.exports = new CartRepository(CartSchema);
