const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const campaignRepository = require("./campaign.repository.js");

class CampaignService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createCampaign(payload, session) {
    const { name, couponRef } = payload;
    if (!name || !couponRef) {
      throw new Error("Name and coupon are required fields.");
    }

    let campaignData = await this.#repository.createCampaign(payload, session);
    return campaignData;
  }

  async getAllCampaign() {
    return await this.#repository.findAll({}, ["couponRef"]);
  }

  async getCampaignWithPagination(payload) {
    const campaign = await this.#repository.getCampaignWithPagination(payload);
    return campaign;
  }

  async getSingleCampaign(id) {
    const campaignData = await this.#repository.findById(id, ["couponRef"]);
    if (!campaignData) throw new NotFoundError("Campaign Not Find");
    return campaignData;
  }

  async updateCampaign(id, payload) {
    const { name, couponRef } = payload;
    if (!name || !couponRef) {
      throw new Error("Name and coupon are required fields.");
    }
    const campaignData = await this.#repository.updateCampaign(id, payload);

    return campaignData;
  }

  async deleteCampaign(id) {
    const campaign = await this.#repository.findById(id);
    if (!campaign) throw new NotFoundError("Campaign not found");
    const deletedCampaign = await this.#repository.deleteById(id);
    return deletedCampaign;
  }
}

module.exports = new CampaignService(campaignRepository, "campaign");
