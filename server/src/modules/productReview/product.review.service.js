const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const productReviewRepository = require("./product.review.repository.js");
const ImgUploader = require("../../middleware/upload/ImgUploder.js");
const orderRepository = require("../order/order.repository.js");

class ProductReviewService extends BaseService {
  #repository;
  #orderRepository;
  constructor(repository, orderRepository, serviceName) {
    super(repository, orderRepository, serviceName);
    this.#repository = repository;
    this.#orderRepository = orderRepository;
  }

  async createProductReview(payload, payloadFiles, session) {
    const { files } = payloadFiles;
    const { name, rating, comment, userRef, productRef } = payload;
    // if (!files) throw new Error("image is required");
    const requiredFields = { name, rating, comment, userRef, productRef };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) throw new Error(`${key} is required`);
    }
    const productPurchase = await this.#orderRepository.findOne({
      userRef: payload.userRef,
      "products.productRef": payload.productRef,
    });
    console.log("productPurchase", productPurchase);
    if (!productPurchase) {
      throw new NotFoundError("Product not purchased by user");
    }

    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    const productReviewData = await this.#repository.createProductReview(
      payload
    );
    return productReviewData;
  }

  async getAllProductReview() {
    return await this.#repository.findAll({ status: true });
  }

  async getProductReviewWithPagination(payload) {
    const productReview = await this.#repository.getProductReviewWithPagination(
      payload
    );
    return productReview;
  }

  
  async getProductReviewWithPaginationForClient(payload) {
    const productReview = await this.#repository.getProductReviewWithPaginationForClient(
      payload
    );
    return productReview;
  }

  async getSingleProductReview(id) {
    const productReviewData = await this.#repository.findById(id);
    if (!productReviewData) throw new NotFoundError("ProductReview Not Find");
    return productReviewData;
  }

  async updateProductReview(id, payload, payloadFiles, session) {
    const { files } = payloadFiles;
    const { rating, comment, userRef, productRef, status } = payload;

    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    const productReviewData = await this.#repository.updateById(id, payload);
    if (!productReviewData) throw new NotFoundError("ProductReview Not Find");

    if (files.length && productReviewData) {
      await removeUploadFile(productReviewData?.image);
    }
    return productReviewData;
  }

  async deleteProductReview(id) {
    const productReview = await this.#repository.findById(id);
    if (!productReview) throw new NotFoundError("ProductReview not found");
    const deletedProductReview = await this.#repository.deleteById(id);
    // if (deletedProductReview) {
    //   await removeUploadFile(productReview?.image);
    // }
    return deletedProductReview;
  }
}

module.exports = new ProductReviewService(
  productReviewRepository,
  orderRepository,
  "productReview"
);

