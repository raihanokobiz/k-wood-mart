const { Router } = require("express");
const controller = require("../../modules/brand/brand.controller.js");
const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const BrandRoute = Router();

// Uncomment the line below if JWT authentication is required
// BrandRoute.use(jwtAuth());

BrandRoute.route("/")
  .post(
    // jwtAuth(null, { module: "brand", action: "create" }),
    upload.any(),
    controller.createBrand
  )
  .get(
    // jwtAuth(null, { module: "brand", action: "access" }),
    controller.getAllBrand
  );

BrandRoute.get("/pagination", controller.getBrandWithPagination);

BrandRoute.route("/:id")
  .get(controller.getSingleBrand)
  .put(upload.any(), controller.updateBrand)
  .delete(controller.deleteBrand);

BrandRoute.put("/status/:id", controller.updateBrandStatus);

module.exports = BrandRoute;
