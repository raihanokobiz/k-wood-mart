// const { ChildCategorySchema } = require("../../models/index.js");
const { ChildCategorySchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class ChildCategoryRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createChildCategory(payload, session) {
    const { viewType } = payload;
    if (viewType) {
      const validViewTypes = ["top", "middle", "lowerMiddle", "buttom"];
      // if (!validViewTypes.includes(viewType)) {
      //   throw new Error("Invalid viewType provided");
      // }
      // await this.#model.findOneAndUpdate(
      //   {  viewType: viewType },
      //   { viewType: '' },
      //   { new: true, session }
      // );
    }

    const newChildCategory = await this.#model.create([payload], { session });
    return newChildCategory;
  }

  async updateChildCategory(id, payload, session) {
    const { viewType } = payload;
    if (viewType) {
      const validViewTypes = ["top", "middle", "lowerMiddle", "buttom"];
      if (!validViewTypes.includes(viewType)) {
        throw new Error("Invalid viewType provided");
      }
      // await this.#model.findOneAndUpdate(
      //   {  viewType: viewType },
      //   { viewType: '' },
      //   { new: true, session }
      // );
    }
    const updatedChildCategory = await this.#model.findByIdAndUpdate(
      id,
      payload
    );
    if (!updatedChildCategory) {
      throw new Error("Child Category not found By Id");
    }
    return updatedChildCategory;
  }

  async getAllChildCategory(payload) {
    const { viewType, limit } = payload;
    let query = {};
    if (viewType) {
      const validViewTypes = ["top", "middle", "lowerMiddle", "buttom"];
      if (!validViewTypes.includes(viewType)) {
        throw new Error("Invalid viewType provided");
      }
      query = { viewType: viewType };
    }
    const childCategorys = await this.#model
      .find(query)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("subCategoryRef");
    return childCategorys;
  }

  async getChildCategoryWithPagination(payload) {
    try {
      const childCategorys = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const childCategorys = await this.#model
            .find({})
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit)
            .populate("subCategoryRef");
          // .populate('')
          const totalChildCategory = await this.#model.countDocuments();

          return { doc: childCategorys, totalDoc: totalChildCategory };
        }
      );

      return childCategorys;
    } catch (error) {
      console.error("Error getting childCategorys with pagination:", error);
      throw error;
    }
  }
}

module.exports = new ChildCategoryRepository(ChildCategorySchema);
