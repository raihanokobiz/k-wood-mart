const { Router } = require("express");
const controller = require("../../modules/subCategory/sub.category.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const SubCategoryRoute = Router();

// Uncomment the line below if JWT authentication is required
// SubCategoryRoute.use(jwtAuth());

SubCategoryRoute.route("/")
  .post(upload.any(), controller.createSubCategory)
  .get(controller.getAllSubCategory);

SubCategoryRoute.get("/pagination", controller.getSubCategoryWithPagination);

SubCategoryRoute.route("/:slug").get(controller.getSingleSubCategoryWithSlug);

SubCategoryRoute.route("/:id")
  .get(controller.getSingleSubCategory)
  .put(upload.any(), controller.updateSubCategory)
  .delete(controller.deleteSubCategory);

SubCategoryRoute.put("/status/:id", controller.updateSubCategoryStatus);

module.exports = SubCategoryRoute;
