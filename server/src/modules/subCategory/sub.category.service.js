const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const subCategoryRepository = require("./sub.category.repository.js");
const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");
const ImgUploader = require("../../middleware/upload/ImgUploder.js");

class SubCategoryService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createSubCategory(payloadFiles, payload, session) {
    const { files } = payloadFiles;
    const { name, status, slug } = payload;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    const subCategoryData = await this.#repository.createSubCategory(
      payload,
      session
    );
    return subCategoryData;
  }

  async getAllSubCategory() {
    return await this.#repository.findAll({}, ["categoryRef"]);
  }

  async getSubCategoryWithPagination(payload) {
    const subCategory = await this.#repository.getSubCategoryWithPagination(
      payload
    );
    return subCategory;
  }

  async getSingleSubCategory(id) {
    const subCategoryData = await this.#repository.findById(id, [
      "categoryRef",
    ]);
    if (!subCategoryData) throw new NotFoundError("SubCategory Not Find");
    return subCategoryData;
  }

  async getSingleSubCategoryWithSlug(slug) {
    const subCategoryData = await this.#repository.findOne({ slug: slug }, [
      "categoryRef",
    ]);
    if (!subCategoryData) throw new NotFoundError("SubCategory Not Find");
    return subCategoryData;
  }

  async updateSubCategory(id, payloadFiles, payload, session) {
    const { files } = payloadFiles;
    const { name, status, slug } = payload;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    // Update the database with the new data
    const subCategoryData = await this.#repository.updateSubCategory(
      id,
      payload,
      session
    );

    // Remove old files if they’re being replaced
    if (files.length && subCategoryData) {
      console.log("run thoids upload reload", subCategoryData?.image);
      await removeUploadFile(subCategoryData?.image);
    }

    return subCategoryData;
  }

  async updateSubCategoryStatus(id, status) {
    if (!status) throw new NotFoundError("Status is required");
    status = status === "true";
    const subCategory = await this.#repository.updateSubCategoryStatus(id, {
      status: status,
    });
    console.log("subCategory", subCategory);
    if (!subCategory) throw new NotFoundError("SubCategory not found");
    return subCategory;
  }

  async deleteSubCategory(id) {
    const subCategory = await this.#repository.findById(id);
    if (!subCategory) throw new NotFoundError("SubCategory not found");
    const deletedSubCategory = await this.#repository.deleteById(id);
    console.log("subCategory", subCategory);
    if (deletedSubCategory && subCategory?.image) {
      await removeUploadFile(subCategory?.image);
    }
    return deletedSubCategory;
  }
}

module.exports = new SubCategoryService(subCategoryRepository, "subCategory");
