const { Router } = require("express");
const controller = require("../../modules/product/product.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const ProductRoute = Router();

// Uncomment the line below if JWT authentication is required
// ProductRoute.use(jwtAuth());

ProductRoute.route("/")
  .post(upload.any(), controller.createProduct)
  .get(controller.getAllProduct);

ProductRoute.get("/search", controller.getSearchProduct);
ProductRoute.get("/best-sell", controller.getAllBestSellProduct);
ProductRoute.get("/discounted-product", controller.getAllDiscountedProduct);
ProductRoute.get("/brand-or-gender", controller.getAllProductByBrandOrGender);
ProductRoute.get("/related-product/:id", controller.getRelatedProduct);
ProductRoute.get("/view-type", controller.getAllProductForHomePage);
ProductRoute.get("/pagination", controller.getProductWithPagination);
ProductRoute.get(
  "/pagination/admin",
  controller.getProductWithPaginationForAdmin
);
ProductRoute.get("/:slug", controller.getSingleProduct);

ProductRoute.route("/:id")
  .put(upload.any(), controller.updateProduct)
  .delete(controller.deleteProduct);

// ProductRoute.put("/status/:id", controller.updateProductStatus);

module.exports = ProductRoute;
