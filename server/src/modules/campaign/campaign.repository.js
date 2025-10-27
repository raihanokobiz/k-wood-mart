// const { CampaignSchema } = require("../../models/index.js");
const { CampaignSchema, CouponSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class CampaignRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createCampaign(payload, session) {
    const newCampaign = await this.#model.create([payload], { session });
    return newCampaign;
  }

  async findCampaignByUserAndProduct(userRef, productRef, inventoryRef) {
    return await this.#model.findOne({ userRef, productRef, inventoryRef });
  }

  async updateCampaign(id, payload) {
    const updatedCampaign = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedCampaign) {
      throw new Error("campaign not found");
    }
    return updatedCampaign;
  }

  async updateCampaignQuantity(campaignId, quantity) {
    return await this.#model.findByIdAndUpdate(
      campaignId,
      { $set: { quantity } },
      { new: true } // Return the updated document
    );
  }

  async getCampaignWithPagination(payload) {
    try {
      const campaigns = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const campaigns = await this.#model
            .find({ userRef: payload.userId })
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit)
            .populate("couponRef");
          // .populate('')
          const totalCampaign = await this.#model.countDocuments();

          return { doc: campaigns, totalDoc: totalCampaign };
        }
      );

      return campaigns;
    } catch (error) {
      console.error("Error getting campaigns with pagination:", error);
      throw error;
    }
  }
}

module.exports = new CampaignRepository(CampaignSchema);
