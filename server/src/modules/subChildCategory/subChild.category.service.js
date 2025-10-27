const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const subChildCategoryRepository = require("./subChild.category.repository.js");
const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");
const ImgUploader = require("../../middleware/upload/ImgUploder.js");

class SubChildCategoryService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createSubChildCategory(payloadFiles, payload, session) {
    const { files } = payloadFiles;
    const { name, status, slug } = payload;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    const subChildCategoryData = await this.#repository.createSubChildCategory(
      payload,
      session
    );
    return subChildCategoryData;
  }

  async getAllSubChildCategory() {
    return await this.#repository.findAll({}, ["childCategoryRef"]);
  }

  async getSubChildCategoryWithPagination(payload) {
    const subChildCategory =
      await this.#repository.getSubChildCategoryWithPagination(payload);
    return subChildCategory;
  }

  async getSingleSubChildCategory(id) {
    const subChildCategoryData = await this.#repository.findById(id, [
      "childCategoryRef",
    ]);
    if (!subChildCategoryData)
      throw new NotFoundError("SubChildCategory Not Find");
    return subChildCategoryData;
  }

  async getSingleSubChildCategoryWithSlug(slug) {
    const subChildCategoryData = await this.#repository.findOne(
      { slug: slug },
      ["childCategoryRef"]
    );
    if (!subChildCategoryData)
      throw new NotFoundError("SubChildCategory Not Find");
    return subChildCategoryData;
  }

  async updateSubChildCategory(id, payloadFiles, payload) {
    const { files } = payloadFiles;
    const { name, status, slug } = payload;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    // Update the database with the new data
    const subChildCategoryData = await this.#repository.updateSubChildCategory(
      id,
      payload
    );

    // Remove old files if they’re being replaced
    if (files.length && subChildCategoryData) {
      console.log("run thoids upload reload", subChildCategoryData?.image);
      await removeUploadFile(subChildCategoryData?.image);
    }

    return subChildCategoryData;
  }

  async updateSubChildCategoryStatus(id, status) {
    if (!status) throw new NotFoundError("Status is required");
    status = status === "true";
    const subChildCategory =
      await this.#repository.updateSubChildCategoryStatus(id, {
        status: status,
      });
    console.log("subChildCategory", subChildCategory);
    if (!subChildCategory)
      throw new NotFoundError("SubChildCategory not found");
    return subChildCategory;
  }

  async deleteSubChildCategory(id) {
    const subChildCategory = await this.#repository.findById(id);
    if (!subChildCategory)
      throw new NotFoundError("SubChildCategory not found");
    const deletedSubChildCategory = await this.#repository.deleteById(id);
    console.log("subChildCategory", subChildCategory);
    // if (deletedSubChildCategory) {
    //   await removeUploadFile(subChildCategory?.image);
    // }
    return deletedSubChildCategory;
  }
}

module.exports = new SubChildCategoryService(
  subChildCategoryRepository,
  "subChildCategory"
);
