const { Router } = require("express");
const controller = require("../../modules/aboutUs/about.us.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const AboutUsRoute = Router();

// Uncomment the line below if JWT authentication is required
// AboutUsRoute.use(jwtAuth());

AboutUsRoute.post("/", upload.any(), controller.createAboutUs).get(
  "/",
  controller.getAllAboutUs
);

AboutUsRoute.route("/:id")
  .get(controller.getSingleAboutUs)
  .put(upload.any(), controller.updateAboutUs)
  .delete(controller.deleteAboutUs);

module.exports = AboutUsRoute;
