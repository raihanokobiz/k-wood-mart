const { Router } = require("express");
const controller = require("../../modules/subChildCategory/subChild.category.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const SubChildCategoryRoute = Router();

// Uncomment the line below if JWT authentication is required
// SubChildCategoryRoute.use(jwtAuth());

SubChildCategoryRoute.route("/")
  .post(upload.any(), controller.createSubChildCategory)
  .get(controller.getAllSubChildCategory);

SubChildCategoryRoute.get(
  "/pagination",
  controller.getSubChildCategoryWithPagination
);

SubChildCategoryRoute.route("/:slug").get(
  controller.getSingleSubChildCategoryWithSlug
);

SubChildCategoryRoute.route("/:id")
  .get(controller.getSingleSubChildCategory)
  .put(upload.any(), controller.updateSubChildCategory)
  .delete(controller.deleteSubChildCategory);

SubChildCategoryRoute.put(
  "/status/:id",
  controller.updateSubChildCategoryStatus
);

module.exports = SubChildCategoryRoute;
