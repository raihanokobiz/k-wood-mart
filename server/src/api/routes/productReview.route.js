const { Router } = require("express");
const controller = require("../../modules/productReview/product.review.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const ProductReviewRoute = Router();
// ProductReviewRoute.use(jwtAuth());

ProductReviewRoute.route("/")
  .post(upload.any(), controller.createProductReview)
  .get(controller.getAllProductReview);

ProductReviewRoute.get(
  "/pagination",
  controller.getProductReviewWithPagination
);
ProductReviewRoute.get(
  "/client/pagination",
  controller.getProductReviewWithPaginationForClient
);

ProductReviewRoute.route("/:id")
  .get(controller.getSingleProductReview)
  .put(upload.any(), controller.updateProductReview)
  .delete(controller.deleteProductReview);

module.exports = ProductReviewRoute;
