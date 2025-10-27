const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const bannerRepository = require("./banner.repository.js");
const {
  convertFileNameWithPdfExt,
} = require("../../middleware/upload/convertFileNameWithPdfExt.js");
const {
  convertFileNameWithWebpExt,
} = require("../../middleware/upload/convertFileNameWithWebpExt.js");
const { uploadWorker } = require("../../middleware/upload/uploadWorker.js");
const {
  convertImgArrayToObject,
} = require("../../middleware/upload/convertImgArrayToObject.js");
const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");
const { isMainThread } = require("worker_threads");
const ImgUploader = require("../../middleware/upload/ImgUploder.js");

class BannerService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createBanner(payload, payloadFiles, session) {
    const { files } = payloadFiles;
    const { title, details, type, status } = payload;
    if (!files) throw new Error("image is required");

    const images = await ImgUploader(files);
    for (const key in images) {
      payload[key] = images[key];
      // console.log(payload, ":payload ", key, ":key");
    }

    const bannerData = await this.#repository.createBanner(payload);
    return bannerData;
  }

  async getAllBanner(payload) {
    const { type } = payload;

    const filter = {
      status: true,
    };

    if (type) filter.type = type;

    return await this.#repository.findAll(filter);
  }

  async getBannerWithPagination(payload) {
    const banner = await this.#repository.getBannerWithPagination(payload);
    return banner;
  }

  async getSingleBanner(id) {
    const bannerData = await this.#repository.findById(id);
    if (!bannerData) throw new NotFoundError("Banner Not Find");
    return bannerData;
  }

  async updateBanner(id, payload, payloadFiles, session) {
    const { files } = payloadFiles;
    const { title, details, type, status } = payload;

    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    const bannerData = await this.#repository.updateById(id, payload);
    if (!bannerData) throw new NotFoundError("Banner Not Find");

    if (files?.length && bannerData) {
      await removeUploadFile(bannerData?.image);
    }
    return bannerData;
  }

  async deleteBanner(id) {
    const banner = await this.#repository.findById(id);
    if (!banner) throw new NotFoundError("Banner not found");
    const deletedBanner = await this.#repository.deleteById(id);
    if (deletedBanner) {
      await removeUploadFile(banner?.image);
    }
    return deletedBanner;
  }
}

module.exports = new BannerService(bannerRepository, "banner");
