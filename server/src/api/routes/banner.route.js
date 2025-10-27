const { Router } = require("express");
const controller = require("../../modules/banner/banner.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const BannerRoute = Router();
// BannerRoute.use(jwtAuth());

BannerRoute.route("/")
  .post(upload.any(), controller.createBanner)
  .get(controller.getAllBanner);

BannerRoute.get("/pagination", controller.getBannerWithPagination);

BannerRoute.route("/:id")
  .get(controller.getSingleBanner)
  .put(upload.any(), controller.updateBanner)
  .delete(controller.deleteBanner);




module.exports = BannerRoute;
