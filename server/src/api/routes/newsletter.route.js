const { Router } = require("express");
const controller = require("../../modules/newsletter/newsletter.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const NewsletterRoute = Router();
// NewsletterRoute.use(jwtAuth());

NewsletterRoute.route("/")
  .post(upload.any(), controller.createNewsletter)
  .get(controller.getAllNewsletter);

NewsletterRoute.get("/pagination", controller.getNewsletterWithPagination);

NewsletterRoute.route("/:id")
  .get(controller.getSingleNewsletter)
  .put(upload.any(), controller.updateNewsletter)
  .delete(controller.deleteNewsletter);

module.exports = NewsletterRoute;
