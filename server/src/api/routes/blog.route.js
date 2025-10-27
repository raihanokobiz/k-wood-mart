const { Router } = require("express");
const controller = require("../../modules/blog/blog.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const BlogRoute = Router();
// BlogRoute.use(jwtAuth());

BlogRoute.route("/")
  .post(upload.any(), controller.createBlog)
  .get(controller.getAllBlog);

BlogRoute.get("/pagination", controller.getBlogWithPagination);
BlogRoute.get("/single/:slug", controller.getSingleBlog);

BlogRoute.route("/:id")
  // .get(controller.getSingleBlog)
  .put(upload.any(), controller.updateBlog)
  .delete(controller.deleteBlog);

module.exports = BlogRoute;
