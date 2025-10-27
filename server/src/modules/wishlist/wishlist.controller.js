const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const WishlistService = require("./wishlist.service.js");
const { default: mongoose } = require("mongoose");

class WishlistController {
  createWishlist = withTransaction(async (req, res, next, session) => {
    console.log(req.body);

    const payload = {
      userRef: req.body.userRef,
      productRef: req.body.productRef,
    };
    const wishlistResult = await WishlistService.createWishlist(
      payload,
      session
    );
    const resDoc = responseHandler(
      201,
      "Wishlist Created successfully",
      wishlistResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllWishlist = catchError(async (req, res, next) => {
    const wishlistResult = await WishlistService.getAllWishlist();
    const resDoc = responseHandler(200, "Get All Wishlists", wishlistResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllWishlistByUser = catchError(async (req, res, next) => {
    const userId = req.query.userId;
    const queryUserId = new mongoose.Types.ObjectId(String(userId));
    console.log(userId, " :user id from user wishlist controller");
    const wishlistResult = await WishlistService.getAllWishlistByUser(
      queryUserId
    );
    const resDoc = responseHandler(
      200,
      `Get All Wishlists of the user: ${userId}`,
      wishlistResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getWishlistWithPagination = catchError(async (req, res, next) => {
    const userId = req.query.userId;
    let payload = {
      userId: userId,
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const wishlist = await WishlistService.getWishlistWithPagination(payload);
    const resDoc = responseHandler(200, "Wishlists get successfully", wishlist);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleWishlist = catchError(async (req, res, next) => {
    const id = req.params.id;
    const wishlistResult = await WishlistService.getSingleWishlist(id);
    const resDoc = responseHandler(
      201,
      "Single Wishlist successfully",
      wishlistResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateWishlist = catchError(async (req, res, next) => {
    const id = req.params.id;
    const payload = {
      userRef: req.body.userRef,
      productRef: req.body.productRef,
    };
    const wishlistResult = await WishlistService.updateWishlist(id, payload);
    const resDoc = responseHandler(201, "Wishlist Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteWishlist = catchError(async (req, res, next) => {
    const id = req.params.id;
    const wishlistResult = await WishlistService.deleteWishlist(id);
    const resDoc = responseHandler(200, "Wishlist Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new WishlistController();
