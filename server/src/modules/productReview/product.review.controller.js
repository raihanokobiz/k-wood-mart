const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const ProductReviewService = require("./product.review.service.js");

class ProductReviewController {
  createProductReview = withTransaction(async (req, res, next, session) => {
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      name: req?.body?.name,
      rating: req?.body?.rating,
      comment: req?.body?.comment,
      userRef: req?.body?.userRef,
      productRef: req?.body?.productRef,
    };
    const productReviewResult = await ProductReviewService.createProductReview(
      payload,
      payloadFiles,
      session
    );
    const resDoc = responseHandler(
      201,
      "ProductReview Created successfully",
      productReviewResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllProductReview = catchError(async (req, res, next) => {
    const productReviewResult =
      await ProductReviewService.getAllProductReview();
    const resDoc = responseHandler(
      200,
      "Get All ProductReviews",
      productReviewResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getProductReviewWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const productReview =
      await ProductReviewService.getProductReviewWithPagination(payload);
    const resDoc = responseHandler(
      200,
      "ProductReviews get successfully",
      productReview
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getProductReviewWithPaginationForClient = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const productReview =
      await ProductReviewService.getProductReviewWithPaginationForClient(payload);
    const resDoc = responseHandler(
      200,
      "ProductReviews get successfully",
      productReview
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleProductReview = catchError(async (req, res, next) => {
    const id = req.params.id;
    const productReviewResult =
      await ProductReviewService.getSingleProductReview(id);
    const resDoc = responseHandler(
      201,
      "Single ProductReview successfully",
      productReviewResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateProductReview = catchError(async (req, res, next) => {
    const id = req.params.id;
    console.log("id", id);
    const payloadFiles = {
      files: req?.files,
    };
    const { rating, comment, userRef, productRef } = req.body;
    console.log("rating", req.body);
    const payload = {
      rating,
      comment,
      userRef,
      productRef,
    };
    const productReviewResult = await ProductReviewService.updateProductReview(
      id,
      payloadFiles,
      payload
    );
    const resDoc = responseHandler(201, "ProductReview Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateProductReviewStatus = catchError(async (req, res, next) => {
    const id = req.params.id;
    const status = req.query.status;
    const productReviewResult =
      await ProductReviewService.updateProductReviewStatus(id, status);
    const resDoc = responseHandler(
      201,
      "ProductReview Status Update successfully"
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteProductReview = catchError(async (req, res, next) => {
    const id = req.params.id;

    const productReviewResult = await ProductReviewService.deleteProductReview(
      id
    );
    const resDoc = responseHandler(200, "ProductReview Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new ProductReviewController();
