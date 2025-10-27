const { Router } = require("express");
const controller = require("../../modules/warehouseTransfer/warehouse.transfer.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const WarehouseTransferRoute = Router();

// Uncomment the line below if JWT authentication is required
// WarehouseTransferRoute.use(jwtAuth());

WarehouseTransferRoute.route("/")
  .post(controller.createWarehouseTransfer)
// .get(controller.getAllWarehouseTransfer);
// WarehouseTransferRoute.route("/calculate").post(
//   upload.any(),
//   controller.calculateWarehouseTransferTotal
// );

// WarehouseTransferRoute.get("/pagination", controller.getWarehouseTransferWithPagination);

WarehouseTransferRoute.get("/pagination/from/:id", controller.getWarehouseTransferFromWithPagination);
WarehouseTransferRoute.get("/pagination/to/:id", controller.getWarehouseTransferToWithPagination);

// WarehouseTransferRoute.route("/:id")
//   .get(controller.getSingleWarehouseTransfer)
//   .put(upload.any(), controller.updateWarehouseTransfer)
//   .delete(controller.deleteWarehouseTransfer);

WarehouseTransferRoute.put("/status/:id", controller.updateWarehouseTransferStatus);

module.exports = WarehouseTransferRoute;
