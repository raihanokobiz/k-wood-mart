const { Router } = require("express");
const controller = require("../../modules/role/role.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const RoleRoute = Router();

// Uncomment the line below if JWT authentication is required
// RoleRoute.use(jwtAuth());

RoleRoute.route("/")
  .post( controller.createRole)
  .get(controller.getAllRole);

RoleRoute.get("/pagination", controller.getRoleWithPagination);

RoleRoute.route("/:id")
  .get(controller.getSingleRole)
  .put(upload.any(), controller.updateRole)
  .delete(controller.deleteRole);

RoleRoute.put("/status/:id", controller.updateRoleStatus);

module.exports = RoleRoute;
