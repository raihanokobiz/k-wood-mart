const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const isArrayElementExist = require("../../utils/isArrayElementExist.js");
const wishlistRepository = require("./wishlist.repository.js");
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
const { default: mongoose } = require("mongoose");

class WishlistService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createWishlist(payload, session) {
    const { userRef, productRef } = payload;
    if (!userRef || !productRef) {
      throw new Error("All fields are required");
    }

    const wishlistData = await this.#repository.createWishlist(
      payload,
      session
    );
    return wishlistData;
  }

  async getAllWishlist() {
    return await this.#repository.findAll();
  }

  async getAllWishlistByUser(userId) {
    return await this.#repository.findAll({ userRef: userId }, ["productRef", "userRef"]);
  }

  async getWishlistWithPagination(payload) {
    const wishlist = await this.#repository.getWishlistWithPagination(payload);
    return wishlist;
  }

  async getSingleWishlist(id) {
    const wishlistData = await this.#repository.findById(id,  ["productRef", "userRef"]);
    if (!wishlistData) throw new NotFoundError("Wishlist Not Find");
    return wishlistData;
  }

  async updateWishlist(id, payload) {
    const { userRef, productRef } = payload;
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

    // Update the database with the new data
    const wishlistData = await this.#repository.updateWishlist(id, payload);

    return wishlistData;
  }

  async deleteWishlist(id) {
    const wishlist = await this.#repository.findById(id);
    if (!wishlist) throw new NotFoundError("Wishlist not found");
    const deletedWishlist = await this.#repository.deleteById(id);
    console.log("wishlist", wishlist);

    return deletedWishlist;
  }
}

module.exports = new WishlistService(wishlistRepository, "wishlist");
