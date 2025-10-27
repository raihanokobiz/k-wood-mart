// const { BrandSchema } = require("../../models/index.js");
const { BrandSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class BrandRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createBrand(payload, session) {
    const newBrand = await this.#model.create([payload], { session });
    return newBrand;
  }

  async updateBrand(id, payload) {
    const updatedBrand = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedBrand) {
      throw new Error("About Us not found");
    }
    return updatedBrand;
  }

  async getBrandWithPagination(payload) {
    try {
      const brands = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const brands = await this.#model
            .find({})
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit);
          // .populate('')
          // .populate('')
          const totalBrand = await this.#model.countDocuments();

          return { doc: brands, totalDoc: totalBrand };
        }
      );

      return brands;
    } catch (error) {
      console.error("Error getting brands with pagination:", error);
      throw error;
    }
  }
}

module.exports = new BrandRepository(BrandSchema);
