// const { SubChildCategorySchema } = require("../../models/index.js");
const { SubChildCategorySchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class SubChildCategoryRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createSubChildCategory(payload, session) {
    // const existingSubChildCategory = await this.#model
    //   .find({}, null, { session })
    //   .sort({ createdAt: -1 });
    // const deleteResult = await this.#model.deleteMany({}, { session });
    // if (deleteResult.deletedCount > 0) {
    //   for (const subChildCategory of existingSubChildCategory) {
    //     if (subChildCategory.image) {
    //       try {
    //         await removeUploadFile(subChildCategory.image);
    //       } catch (fileError) {
    //         console.error(
    //           `Failed to remove file: ${subChildCategory.image}`,
    //           fileError
    //         );
    //       }
    //     }
    //   }
    // }

    const newSubChildCategory = await this.#model.create([payload], { session });
    return newSubChildCategory;
  }

  async updateSubChildCategory(id, payload) {
    const updatedSubChildCategory = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedSubChildCategory) {
      throw new Error("Sub Child Category not found");
    }
    return updatedSubChildCategory;
  }

  async getSubChildCategoryWithPagination(payload) {
    try {
      const subChildCategorys = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const subChildCategorys = await this.#model
            .find({})
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit)
            .populate('childCategoryRef')
          // .populate('')
          const totalSubChildCategory = await this.#model.countDocuments();

          return { doc: subChildCategorys, totalDoc: totalSubChildCategory };
        }
      );

      return subChildCategorys;
    } catch (error) {
      console.error("Error getting subChildCategorys with pagination:", error);
      throw error;
    }
  }
}

module.exports = new SubChildCategoryRepository(SubChildCategorySchema);
