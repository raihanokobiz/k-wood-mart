const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const subCategoryRepository = require("./sub.category.repository.js");
const categoryRepository = require("../category/category.repository.js");

const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");
const ImgUploader = require("../../middleware/upload/ImgUploder.js");
const { CategorySchema, SubCategorySchema } = require("../../models/index.js");

class SubCategoryService extends BaseService {
  #repository;
  #categoryRepository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
    this.#categoryRepository = categoryRepository;
  }

  async createSubCategory(payloadFiles, payload, session) {
    const { files } = payloadFiles;
    if (files?.image?.length) {
      const uploadedImage = await ImgUploader(files.image);
      payload.image = uploadedImage.image;
    }

    if (files?.bannerImage?.length) {
      const uploadedBanner = await ImgUploader(files.bannerImage);
      payload.bannerImage = uploadedBanner.bannerImage;
    }

    console.log("payload", payload);

    const subCategoryData = await this.#repository.createSubCategory(
      payload,
      session
    );
    return subCategoryData;
  }

  async getAllSubCategory() {
    const furnitureCategory = await this.#categoryRepository.findOne({
      name: { $regex: "^furnitures?$", $options: "i" },
    });

    const furnitureCategoryId = furnitureCategory?._id?.toString();

    // Step 2: Get all subcategories
    const data = await this.#repository.findAll({}, ["categoryRef"]);

    // Step 3: Sort — Furniture first
    if (furnitureCategoryId) {
      data.sort((a, b) => {
        if (a.categoryRef?._id?.toString() === furnitureCategoryId) return -1;
        if (b.categoryRef?._id?.toString() === furnitureCategoryId) return 1;
        return 0;
      });
    }

    return data;
  }

  // three
  async getThreeForFurniture() {
    const furnitureCategory = await CategorySchema.findOne({
      name: /furniture/i,
    });

    if (!furnitureCategory) return [];

    return this.#repository.findAll({
      categoryRef: furnitureCategory._id,
    });
  }

  // two
  async getTwoForCurtain() {
    const curtainsCategory = await CategorySchema.findOne({
      name: /curtains/i,
    });

    if (!curtainsCategory) return [];

    return this.#repository.findAll({
      categoryRef: curtainsCategory._id,
    });
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

    const oldData = await SubCategorySchema.findById(id);

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

    // Remove old files if they're being replaced
    if (files?.length && oldData?.image) {
      try {
        await removeUploadFile(oldData.image);
      } catch (error) {
        console.warn(`Failed to remove old file: ${oldData.image}`, error);
        // Don't re-throw - the update was successful, file removal is secondary
      }
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
