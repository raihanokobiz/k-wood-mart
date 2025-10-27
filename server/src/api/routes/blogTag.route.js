const { Router } = require("express");
const controller = require("../../modules/BlogTag/blogTag.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const BlogTagRoute = Router();
// BlogTagRoute.use(jwtAuth());

BlogTagRoute.route("/")
  .post(upload.any(), controller.createBlogTag)
  .get(controller.getAllBlogTag);

BlogTagRoute.get("/pagination", controller.getBlogTagWithPagination);

BlogTagRoute.route("/:id")
  .get(controller.getSingleBlogTag)
  .put(upload.any(), controller.updateBlogTag)
  .delete(controller.deleteBlogTag);

module.exports = BlogTagRoute;
