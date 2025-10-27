// const { OrderBulkSchema } = require("../../models/index.js");
const { OrderBulkSchema, CouponSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class OrderBulkRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createOrderBulk(payload, session) {
    const newOrderBulk = await this.#model.create([payload], { session });
    return newOrderBulk;
  }



  async findOrderBulkByUserAndProduct(userRef, productRef, inventoryRef) {
    return await this.#model.findOne({ userRef, productRef, inventoryRef });
  }

  async updateOrderBulk(id, payload) {
    const updatedOrderBulk = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedOrderBulk) {
      throw new Error("Bulk order not found");
    }
    return updatedOrderBulk;
  }

  async updateOrderBulkQuantity(orderBulkId, quantity) {
    return await this.#model.findByIdAndUpdate(
      orderBulkId,
      { $set: { quantity } },
      { new: true } // Return the updated document
    );
  }

  async getOrderBulkWithPagination(payload) {
    try {
      const orderBulks = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const orderBulks = await this.#model
            .find({ userRef: payload.userId })
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit);
          // .populate('')
          // .populate('')
          const totalOrderBulk = await this.#model.countDocuments();

          return { doc: orderBulks, totalDoc: totalOrderBulk };
        }
      );

      return orderBulks;
    } catch (error) {
      console.error("Error getting orderBulks with pagination:", error);
      throw error;
    }
  }
}

module.exports = new OrderBulkRepository(OrderBulkSchema);