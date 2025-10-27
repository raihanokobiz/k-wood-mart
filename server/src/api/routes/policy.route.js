const { Router } = require("express");
const controller = require("../../modules/policy/policy.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const PolicyRoute = Router();

// Uncomment the line below if JWT authentication is required
// PolicyRoute.use(jwtAuth());

PolicyRoute.route("/")
  .post(upload.any(), controller.createPolicy)
  .get(controller.getAllPolicy);

PolicyRoute.get("/pagination", controller.getPolicyWithPagination);

PolicyRoute.route("/:id")
  .get(controller.getSinglePolicy)
  .put(upload.any(), controller.updatePolicy)
  .delete(controller.deletePolicy);

PolicyRoute.put("/status/:id", controller.updatePolicyStatus);

module.exports = PolicyRoute;
