const { WarehouseTransferSchema, CartSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class WarehouseTransferRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createWarehouseTransfer(payload, session) {
    const newWarehouseTransfer = await this.#model.create([payload], { session });
    return newWarehouseTransfer;
  }

  async updateWarehouseTransfer(id, payload) {
    const updatedWarehouseTransfer = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedWarehouseTransfer) {
      throw new Error("Warehouse Transfer not found");
    }
    return updatedWarehouseTransfer;
  }

  async getWarehouseTransferFromWithPagination(idFrom, payload) {
    try {
      let query = {};
      if (idFrom) {
        query = { fromWarehouseRef: idFrom,...query };
      }
      const warehouseTransfers = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const warehouseTransfers = await this.#model
            .find(query)
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit)
            .populate([
              { path: "fromWarehouseRef" },
              { path: "toWarehouseRef" },
              { path: "inventoryRef" },
            ]);
          // .populate('')
          const totalWarehouseTransfer = await this.#model.countDocuments(query);

          return { doc: warehouseTransfers, totalDoc: totalWarehouseTransfer };
        }
      );

      return warehouseTransfers;
    } catch (error) {
      console.error("Error getting warehouseTransfers with pagination:", error);
      throw error;
    }
  }
  async getWarehouseTransferToWithPagination(idTo, payload) {
    try {
      let query = {};
      if (idTo) {
        query = { toWarehouseRef: idTo,...query };
      }
      const warehouseTransfers = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const warehouseTransfers = await this.#model
            .find(query)
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit)
            .populate([
              { path: "fromWarehouseRef" },
              { path: "toWarehouseRef" },
              { path: "inventoryRef" },
            ]);
          // .populate('')
          const totalWarehouseTransfer = await this.#model.countDocuments(query);

          return { doc: warehouseTransfers, totalDoc: totalWarehouseTransfer };
        }
      );

      return warehouseTransfers;
    } catch (error) {
      console.error("Error getting warehouseTransfers with pagination:", error);
      throw error;
    }
  }

  // async calculateWarehouseTransferTotal(payload) {
  //   try {
  //     const { userRef, warehouseTransferRef } = payload;
  //     const cartItems = await CartSchema.find({ userRef: userRef }).populate(
  //       "productRef"
  //     );

  //     if (!cartItems || cartItems.length === 0) {
  //       throw new Error("Cart is empty.");
  //     }

  //     // 2. Calculate subtotal
  //     let subTotal = cartItems.reduce(
  //       (acc, item) =>
  //         acc +
  //         (item.productRef.price - item.productRef.discountAmount) *
  //         item.quantity,
  //       0
  //     );

  //     let discount = 0;
  //     let total = subTotal;

  //     if (warehouseTransferRef) {
  //       // 3. Validate the warehouseTransfer
  //       const warehouseTransfer = await this.#model.findById(warehouseTransferRef);
  //       if (!warehouseTransfer) {
  //         throw new Error("Invalid warehouseTransfer.");
  //       }

  //       // Check expiration
  //       const now = new Date();
  //       if (warehouseTransfer.expireDate && now > warehouseTransfer.expireDate) {
  //         throw new Error("WarehouseTransfer expired.");
  //       }

  //       // Check usage limit
  //       if (warehouseTransfer.used >= warehouseTransfer.useLimit) {
  //         throw new Error("WarehouseTransfer usage limit reached.");
  //       }

  //       const eligibleItems = cartItems.filter((item) => {
  //         if (warehouseTransfer.discountType === "brand") {
  //           return (
  //             item.productRef.brandRef?.toString() ===
  //             warehouseTransfer.brandRef?.toString()
  //           );
  //         } else if (warehouseTransfer.discountType === "category") {
  //           return (
  //             item.productRef.categoryRef?.toString() ===
  //             warehouseTransfer.categoryRef?.toString()
  //           );
  //         } else if (warehouseTransfer.discountType === "subCategory") {
  //           return (
  //             item.productRef.subCategoryRef?.toString() ===
  //             warehouseTransfer.subCategoryRef?.toString()
  //           );
  //         }
  //         return false;
  //       });

  //       const eligibleSubtotal = eligibleItems.reduce(
  //         (acc, item) =>
  //           acc +
  //           (item.productRef.price - item.productRef.discountAmount) *
  //           item.quantity,
  //         0
  //       );

  //       discount = Math.min(warehouseTransfer.discount, eligibleSubtotal);

  //       // Update warehouseTransfer usage
  //       await this.#model.findByIdAndUpdate(warehouseTransferRef, { $inc: { used: 1 } });

  //       total = subTotal - discount;
  //     }

  //     // 5. Return response
  //     return {
  //       subTotal,
  //       discount,
  //       total,
  //       warehouseTransferApplied: !!warehouseTransferRef,
  //     };
  //   } catch (error) {
  //     console.error("Error calculating warehouseTransfer total:", error);
  //     throw error;
  //   }
  // }
}

module.exports = new WarehouseTransferRepository(WarehouseTransferSchema);
