const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const isArrayElementExist = require("../../utils/isArrayElementExist.js");
const brandRepository = require("./brand.repository.js");
const { isMainThread } = require("worker_threads");
const { log } = require("console");
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
const ImgUploader = require("../../middleware/upload/ImgUploder.js");

class BrandService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createBrand(payloadFiles, payload, session) {
    const { files } = payloadFiles;
    const { name, slug, status } = payload;
    // if (
    //   !header ||
    //   !title ||
    //   !description ||
    //   //   !honorName ||
    //   !whatsApp ||
    //   !email
    // ) {
    //   throw new Error("All fields are required");
    // }
    // console.log("file", files);

    const images = await ImgUploader(files);
    for (const key in images) {
      payload[key] = images[key];
    }

    const brandData = await this.#repository.createBrand(payload, session);
    return brandData;
  }

  async getAllBrand() {
    return await this.#repository.findAll();
  }

  async getBrandWithPagination(payload) {
    const brand = await this.#repository.getBrandWithPagination(payload);
    return brand;
  }

  async getSingleBrand(id) {
    const brandData = await this.#repository.findById(id);
    if (!brandData) throw new NotFoundError("Brand Not Find");
    return brandData;
  }

  async updateBrand(id, payloadFiles, payload) {
    const { files } = payloadFiles;
    const { name, slug, status } = payload;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    // Update the database with the new data
    const brandData = await this.#repository.updateBrand(id, payload);

    // Remove old files if they’re being replaced
    if (files.length && brandData) {
      console.log("run thoids upload reload", brandData?.image);
      await removeUploadFile(brandData?.image);
    }

    return brandData;
  }

  async updateBrandStatus(id, status) {
    if (!status) throw new NotFoundError("Status is required");
    status = status === "true";
    const brand = await this.#repository.updateBrandStatus(id, {
      status: status,
    });
    console.log("brand", brand);
    if (!brand) throw new NotFoundError("Brand not found");
    return brand;
  }

  async deleteBrand(id) {
    const brand = await this.#repository.findById(id);
    if (!brand) throw new NotFoundError("Brand not found");
    const deletedBrand = await this.#repository.deleteById(id);
    console.log("brand", brand);
    if (deletedBrand) {
      await removeUploadFile(brand?.image);
    }
    return deletedBrand;
  }
}

module.exports = new BrandService(brandRepository, "brand");
