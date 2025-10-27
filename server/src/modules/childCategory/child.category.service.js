const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const childCategoryRepository = require("./child.category.repository.js");
const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");
const ImgUploader = require("../../middleware/upload/ImgUploder.js");

class ChildCategoryService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createChildCategory(payloadFiles, payload, session) {
    const { files } = payloadFiles;
    const { name, status, slug } = payload;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    const childCategoryData = await this.#repository.createChildCategory(
      payload,
      session
    );
    return childCategoryData;
  }

  async getAllChildCategory(payload) {
    // const payload = {
    //   viewType: "",
    //   limit: 10,
    // };

    return await this.#repository.getAllChildCategory(payload);
  }

  async getChildCategoryWithPagination(payload) {
    const childCategory = await this.#repository.getChildCategoryWithPagination(
      payload
    );
    return childCategory;
  }

  async getSingleChildCategory(id) {
    const childCategoryData = await this.#repository.findById(id, [
      "subCategoryRef",
    ]);
    if (!childCategoryData) throw new NotFoundError("ChildCategory Not Find");
    return childCategoryData;
  }

  async getSingleChildCategoryWithSlug(slug) {
    const childCategoryData = await this.#repository.findOne({ slug: slug }, [
      "subCategoryRef",
    ]);
    if (!childCategoryData) throw new NotFoundError("ChildCategory Not Find");
    return childCategoryData;
  }

  async updateChildCategory(id, payloadFiles, payload, session) {
    const { files } = payloadFiles;
    const { name, status, slug } = payload;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    // Update the database with the new data
    const childCategoryData = await this.#repository.updateChildCategory(
      id,
      payload,
      session
    );

    // Remove old files if they’re being replaced
    if (files?.length && childCategoryData.image) {
      console.log("run thoids upload reload", childCategoryData?.image);
      await removeUploadFile(childCategoryData?.image);
    }

    return childCategoryData;
  }

  async updateChildCategoryStatus(id, status) {
    if (!status) throw new NotFoundError("Status is required");
    status = status === "true";
    const childCategory = await this.#repository.updateChildCategoryStatus(id, {
      status: status,
    });
    console.log("childCategory", childCategory);
    if (!childCategory) throw new NotFoundError("ChildCategory not found");
    return childCategory;
  }

  async deleteChildCategory(id) {
    const childCategory = await this.#repository.findById(id);
    if (!childCategory) throw new NotFoundError("ChildCategory not found");
    const deletedChildCategory = await this.#repository.deleteById(id);
    console.log("childCategory", childCategory);
    // if (deletedChildCategory) {
    //   await removeUploadFile(childCategory?.image);
    // }
    return deletedChildCategory;
  }
}

module.exports = new ChildCategoryService(
  childCategoryRepository,
  "childCategory"
);
