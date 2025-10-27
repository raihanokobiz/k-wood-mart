const { ProductReviewSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");



class ProductReviewRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createProductReview(payload) {
    const newProductReview = await this.#model.create(payload);
    return newProductReview;
  }

  async getProductReviewWithPagination(payload) {
    try {
      const productReviews = await pagination(payload, async (limit, offset, sortOrder) => {
        const productReviews = await this.#model.find({
        })
          .sort({ createdAt: sortOrder, })
          .skip(offset)
          .limit(limit)
        // .populate('') 
        // .populate('') 
        const totalProductReview = await this.#model.countDocuments();

        return { doc: productReviews, totalDoc: totalProductReview };
      });

      return productReviews;
    } catch (error) {
      console.error("Error getting productReviews with pagination:", error);
      throw error;
    }
  }

  async getProductReviewWithPaginationForClient(payload) {
    try {
      const productReviews = await pagination(payload, async (limit, offset, sortOrder) => {
        const productReviews = await this.#model.find({
          status: true,


        })
          .sort({ rating: -1, })
          .skip(offset)
          .limit(limit)
        // .populate('') 
        // .populate('') 
        const totalProductReview = await this.#model.countDocuments();

        return { doc: productReviews, totalDoc: totalProductReview };
      });

      return productReviews;
    } catch (error) {
      console.error("Error getting productReviews with pagination:", error);
      throw error;
    }
  }


}

module.exports = new ProductReviewRepository(ProductReviewSchema);

