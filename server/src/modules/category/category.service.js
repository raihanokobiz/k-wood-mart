const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const isArrayElementExist = require("../../utils/isArrayElementExist.js");
const categoryRepository = require("./category.repository.js");
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

class CategoryService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createCategory(payloadFiles, payload, session) {
    const { files } = payloadFiles;
    const { name, slug, subCategoryRef, status, colorCode } = payload;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    const categoryData = await this.#repository.createCategory(
      payload,
      session
    );
    return categoryData;
  }

  async getAllCategory() {
    // return await this.#repository.findAll();
    return await this.#repository.getAllCategory();
  }

  async getCategoryWithPagination(payload) {
    const category = await this.#repository.getCategoryWithPagination(payload);
    return category;
  }

  async getSingleCategory(id) {
    const categoryData = await this.#repository.getCategoryById(id);
    if (!categoryData) throw new NotFoundError("Category Not Find");
    return categoryData;
  }

  async getSingleCategoryWithSlug(slug) {
    const categoryData = await this.#repository.getCategoryBySlug(slug);
    if (!categoryData) throw new NotFoundError("Category Not Find");
    return categoryData;
  }

  async getNavBar() {
    const navbarData = await this.#repository.getNavBar();
    if (!navbarData) throw new NotFoundError("Navbar Not Find");
    return navbarData;
  }

  async updateCategory(id, payloadFiles, payload) {
    const { files } = payloadFiles;
    const { name, slug, subCategoryRef, status, colorCode } = payload;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    // Update the database with the new data
    const categoryData = await this.#repository.updateCategory(id, payload);

    // Remove old files if they’re being replaced
    if (files.length && categoryData) {
      console.log("run thoids upload reload", categoryData?.image);
      await removeUploadFile(categoryData?.image);
    }

    return categoryData;
  }

  async updateCategoryStatus(id, status) {
    if (!status) throw new NotFoundError("Status is required");
    status = status === "true";
    const category = await this.#repository.updateCategoryStatus(id, {
      status: status,
    });
    console.log("category", category);
    if (!category) throw new NotFoundError("Category not found");
    return category;
  }

  async deleteCategory(id) {
    const category = await this.#repository.findById(id);
    if (!category) throw new NotFoundError("Category not found");
    const deletedCategory = await this.#repository.deleteById(id);
    console.log("category", category);
    if (deletedCategory) {
      await removeUploadFile(category?.image);
    }
    return deletedCategory;
  }
}

module.exports = new CategoryService(categoryRepository, "category");
