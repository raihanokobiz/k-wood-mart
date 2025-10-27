const { Router } = require("express");
const controller = require("../../modules/childCategory/child.category.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const ChildCategoryRoute = Router();

// Uncomment the line below if JWT authentication is required
// ChildCategoryRoute.use(jwtAuth());

ChildCategoryRoute.route("/")
  .post(upload.any(), controller.createChildCategory)
  .get(controller.getAllChildCategory);

ChildCategoryRoute.get(
  "/pagination",
  controller.getChildCategoryWithPagination
);

ChildCategoryRoute.route("/:slug").get(
  controller.getSingleChildCategoryWithSlug
);

ChildCategoryRoute.route("/:id")
  .get(controller.getSingleChildCategory)
  .put(upload.any(), controller.updateChildCategory)
  .delete(controller.deleteChildCategory);

ChildCategoryRoute.put("/status/:id", controller.updateChildCategoryStatus);

module.exports = ChildCategoryRoute;
