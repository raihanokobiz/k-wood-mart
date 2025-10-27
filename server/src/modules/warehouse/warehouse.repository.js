// const { WarehouseSchema } = require("../../models/index.js");
const { default: mongoose } = require("mongoose");
const { WarehouseSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class WarehouseRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createWarehouse(payload, session) {
    const newWarehouse = await this.#model.create([payload], { session });
    return newWarehouse;
  }

  // async getAllWarehouse() {
  //   const warehouse = await this.#model.find();
  //   return warehouse;
  // }


  async updateWarehouse(id, payload) {
    const updatedWarehouse = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedWarehouse) {
      throw new Error("Warehouse not found");
    }
    return updatedWarehouse;
  }

  async getWarehouseWithPagination(payload) {
    try {
      const warehouseWithPagination = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const warehouse = await this.#model
            .find()
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .populate([
              { path: "managerRef", select: "" },
              // { path: "categoryRef", select: "" },
              // { path: "subCategoryRef", select: "" },
              // { path: "childCategoryRef", select: "" },
              // { path: "subChildCategoryRef", select: "" },
              // { path: "brandRef", select: "" },
            ]);

          // Filter out warehouse without matching inventory
          const totalProduct = await this.#model.countDocuments();

          return { doc: warehouse, totalDoc: totalProduct };
        }
      );
      return warehouseWithPagination;
    } catch (error) {
      console.error("Error getting warehouses with pagination:", error);
      throw error;
    }
  }
}

module.exports = new WarehouseRepository(WarehouseSchema);
