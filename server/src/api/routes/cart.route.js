const { Router } = require("express");
const controller = require("../../modules/cart/cart.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const CartRoute = Router();

// Uncomment the line below if JWT authentication is required
// CartRoute.use(jwtAuth());

CartRoute.route("/")
  .post(upload.any(), controller.createCart)
  // .get(controller.getAllCart)
  .get(controller.getAllCartByUser);

CartRoute.get("/all", controller.getAllCart);

CartRoute.get("/pagination", controller.getCartWithPagination);

CartRoute.route("/:id")
  .get(controller.getSingleCart)
  .put(upload.any(), controller.updateCartQuantity)
  .delete(controller.deleteCart);

module.exports = CartRoute;
