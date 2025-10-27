const { Router } = require("express");
const controller = require("../../modules/warehouse/warehouse.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const WarehouseRoute = Router();

// Uncomment the line below if JWT authentication is required
// WarehouseRoute.use(jwtAuth());

WarehouseRoute.route("/")
  .post( controller.createWarehouse)
  .get(controller.getAllWarehouse);

WarehouseRoute.get("/pagination", controller.getWarehouseWithPagination);

WarehouseRoute.route("/:id")
  .get(controller.getSingleWarehouse)
  .put( controller.updateWarehouse)
  .delete(controller.deleteWarehouse);

WarehouseRoute.put("/status/:id", controller.updateWarehouseStatus);

module.exports = WarehouseRoute;
