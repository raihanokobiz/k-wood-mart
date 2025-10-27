// const { PolicySchema } = require("../../models/index.js");
const { PolicySchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class PolicyRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createPolicy(payload, session) {
    // const existingPolicy = await this.#model
    //   .find({}, null, { session })
    //   .sort({ createdAt: -1 });
    // const deleteResult = await this.#model.deleteMany({}, { session });
    // if (deleteResult.deletedCount > 0) {
    //   for (const policy of existingPolicy) {
    //     if (policy.image) {
    //       try {
    //         await removeUploadFile(policy.image);
    //       } catch (fileError) {
    //         console.error(`Failed to remove file: ${policy.image}`, fileError);
    //       }
    //     }
    //   }
    // }

    const newPolicy = await this.#model.create([payload], { session });
    return newPolicy;
  }

  async updatePolicy(id, payload) {
    const updatedPolicy = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedPolicy) {
      throw new Error("About Us not found");
    }
    return updatedPolicy;
  }

  async getPolicyWithPagination(payload) {
    try {
      const policys = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const policys = await this.#model
            .find({})
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit);
          // .populate('')
          // .populate('')
          const totalPolicy = await this.#model.countDocuments();

          return { doc: policys, totalDoc: totalPolicy };
        }
      );

      return policys;
    } catch (error) {
      console.error("Error getting policys with pagination:", error);
      throw error;
    }
  }
}

module.exports = new PolicyRepository(PolicySchema);
