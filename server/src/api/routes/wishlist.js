const { Router } = require("express");
const controller = require("../../modules/wishlist/wishlist.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const WishlistRoute = Router();

// Uncomment the line below if JWT authentication is required
// WishlistRoute.use(jwtAuth());

WishlistRoute.route("/")
  .post(upload.any(), controller.createWishlist)
  // .get(controller.getAllWishlist)
  .get(controller.getAllWishlistByUser);

WishlistRoute.get("/pagination", controller.getWishlistWithPagination);

WishlistRoute.route("/:id")
  .get(controller.getSingleWishlist)
  .put(upload.any(), controller.updateWishlist)
  .delete(controller.deleteWishlist);

module.exports = WishlistRoute;
