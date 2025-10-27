const { BannerSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class BannerRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createBanner(payload) {
    const newBanner = await this.#model.create(payload);
    return newBanner;
  }

  async getBannerWithPagination(payload) {
    try {
      const banners = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const banners = await this.#model
            .find({})
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit);
          // .populate('')
          // .populate('')
          const totalBanner = await this.#model.countDocuments();

          return { doc: banners, totalDoc: totalBanner };
        }
      );

      return banners;
    } catch (error) {
      console.error("Error getting banners with pagination:", error);
      throw error;
    }
  }
}

module.exports = new BannerRepository(BannerSchema);
