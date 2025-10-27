// const { OrderSchema } = require("../../models/index.js");
const {
  OrderSchema,
  CartSchema,
  CouponSchema,
} = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");
const inventoryRepository = require("../inventory/inventory.repository.js");

class OrderRepository extends BaseRepository {
  #model;
  #inventoryRepository = inventoryRepository;
  constructor( inventoryRepository, model) {
    super( model);
    this.#model = model;
    this.#inventoryRepository = inventoryRepository;
  }

  async createOrder(payload, session) {
    // same as cart repository -------------------------
    const {
      orderId,
      shippingCost,
      coupon,
      userRef,
      customerName,
      customerPhone,
      customerEmail,
      customerCity,
      customerAddress,
      customerHouse,
      customerRoad,
      customerThana,
      customerAltPhone,
      paymentMethod,
      note,
    } = payload;

    const isObjectId = /^[a-f\d]{24}$/i.test(userRef);
    const query = {};
    if (!isObjectId) {
      query.correlationId = userRef;
    } else {
      query.userRef = userRef;
    }
    const carts = await CartSchema.find(query)
      .populate("productRef")
      .populate("userRef")
      .populate("inventoryRef");

    console.log(carts, "carts from order create repo.......");

    let appliedCoupon = null;
    let exitCoupon;
    if (coupon) {
      exitCoupon = await CouponSchema.findOne({ code: coupon });

      const now = new Date();
      if (exitCoupon) {
        if (
          now > exitCoupon.startDate &&
          now < exitCoupon.expireDate &&
          exitCoupon.useLimit >= exitCoupon.used
        ) {
          appliedCoupon = exitCoupon;
        }
      }
    }

    let totalPrice = 0;
    let subTotalPrice = 0;
    let totalSaved = 0;
    let totalCouponDiscount = 0;
    let productDiscount = 0;

    const cartDetails = carts.map((cart) => {
      const product = cart.productRef;
      const inventory = cart.inventoryRef;
      const quantity = cart.quantity;
      const price = inventory?.price || 0;
      const discountAmount = inventory?.discountAmount || 0;

      let couponDiscount = 0;

      // ✅ Apply coupon if it's applicable
      if (appliedCoupon) {
        if (
          String(appliedCoupon?.categoryRef) === String(product?.categoryRef) ||
          String(appliedCoupon?.subCategoryRef) ===
            String(product?.subCategoryRef) ||
          String(appliedCoupon?.childCategoryRef) ===
            String(product?.childCategoryRef)
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
      subTotalPrice += subtotal + savedAmount;
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
    //  same as cart repository ------------------------
    // Fetch the user's cart items
    // const cartItems = await CartSchema.find({
    //   userRef: payload.userRef,
    // });

    if (carts.length === 0) {
      throw new Error("Cart is empty, cannot place order.");
    }

    // Convert cart items into order format
    const products = carts.map((item) => ({
      productRef: item.productRef,
      inventoryRef: item.inventoryRef,
      quantity: item.quantity,
      price: item.inventoryRef.price,
      mrpPrice: item.inventoryRef?.mrpPrice,
      // productDiscount: item.productRef?.productDiscount,
    }));

    const newOrder = await this.#model.create(
      [
        {
          orderId: orderId,
          subTotalPrice: subTotalPrice,
          totalPrice: totalPrice, //
          couponDiscount: totalCouponDiscount, //
          shippingCost: shippingCost, //
          status: "OrderPlaced", // Default status
          // userRef: userRef, //
          ...query,
          couponRef: exitCoupon?._id || null, //
          customer: payload.customer,
          customerName,
          customerPhone,
          customerEmail,
          customerCity,
          customerAddress,
          customerHouse,
          customerRoad,
          customerThana,
          customerAltPhone,
          paymentMethod,
          note,
          products: products,
        },
      ],
      { session }
    );
    await CartSchema.deleteMany(query, { session });
    console.log("cart items from order repo++++++++++++++++", newOrder );
    console.log("cart items from order repo++++++++++++++++", products );

    // Clear the cart after order is placed
    // await CartSchema.deleteMany(query, { session });
        // orderData?.products loop than call this.#inventoryRepository.updateInventoryOnOrderPlace .
    for (const product of products) {
      await this.#inventoryRepository.updateInventoryOnOrderPlace(
        product?.inventoryRef?._id,
        product?.quantity,
        session
      );
    }

    return newOrder[0];
  }

  async updateOrder(id, payload) {
    const updatedOrder = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedOrder) {
      throw new Error("About Us not found");
    }
    return updatedOrder;
  }

  async getOrderWithPagination(payload) {
    try {
      const orders = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const orders = await this.#model
            .find({ warehouseRef: payload.warehouseRef })
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit)
            .populate("paymentRef")
            .populate("products.productRef")
            .populate("products.inventoryRef")
            .populate({
              path: "userRef",
              select: "-password", // Exclude the password field
            });
          // .populate('')
          const totalOrder = await this.#model.countDocuments({
            warehouseRef: payload.warehouseRef,
          });

          return { doc: orders, totalDoc: totalOrder };
        }
      );

      return orders;
    } catch (error) {
      console.error("Error getting orders with pagination:", error);
      throw error;
    }
  }

  async updateOrderStatus(id, status) {
    const updatedOrder = await this.#model.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      throw new Error("Order not found");
    }
    return updatedOrder;
  }

  async getOrderReport(startDate, endDate) {
    console.log("startDate", startDate);
    console.log("endDate", endDate);

    const statuses = [
      "OrderPlaced",
      "DeliveredPending",
      "Delivered",
      "Cancelled",
      "Hold",
      "InReview",
    ];

    const orders = await OrderSchema.aggregate([
      // Match only orders within the time frame
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      // Group by status and sum values
      {
        $group: {
          _id: "$status",
          totalOrders: { $sum: 1 },
          totalSubTotalPrice: { $sum: { $ifNull: ["$subTotalPrice", 0] } },
          totalProducts: { $sum: { $sum: "$products.quantity" } },
        },
      },
      // Add missing statuses
      {
        $group: {
          _id: null,
          existingStatuses: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          mergedData: {
            $map: {
              input: statuses,
              as: "status",
              in: {
                status: "$$status", // Rename _id to status
                totalOrders: {
                  $let: {
                    vars: {
                      match: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$existingStatuses",
                              as: "e",
                              cond: { $eq: ["$$e._id", "$$status"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ["$$match.totalOrders", 0] },
                  },
                },
                totalSubTotalPrice: {
                  $let: {
                    vars: {
                      match: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$existingStatuses",
                              as: "e",
                              cond: { $eq: ["$$e._id", "$$status"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ["$$match.totalSubTotalPrice", 0] },
                  },
                },
                totalProducts: {
                  $let: {
                    vars: {
                      match: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: "$existingStatuses",
                              as: "e",
                              cond: { $eq: ["$$e._id", "$$status"] },
                            },
                          },
                          0,
                        ],
                      },
                    },
                    in: { $ifNull: ["$$match.totalProducts", 0] },
                  },
                },
              },
            },
          },
        },
      },
      { $unwind: "$mergedData" },
      { $replaceRoot: { newRoot: "$mergedData" } },
      { $sort: { totalOrders: -1 } }, // Sort by total orders (optional)
    ]);

    // If no orders are found, return the statuses with zero values
    if (orders.length === 0) {
      return statuses.map((status) => ({
        status: status, // Rename _id to status
        totalOrders: 0,
        totalSubTotalPrice: 0,
        totalProducts: 0,
      }));
    }

    return orders;
  }
  async getProfitLossReport(startDate, endDate, warehouseRef) {
    const orders = await OrderSchema.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
          warehouseRef,
        },
      },
    ]);
  }
}

module.exports = new OrderRepository(inventoryRepository, OrderSchema);
