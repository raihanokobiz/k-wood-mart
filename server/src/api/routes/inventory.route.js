const { Router } = require("express");
const controller = require("../../modules/inventory/inventory.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const InventoryRoute = Router();

// Uncomment the line below if JWT authentication is required
// InventoryRoute.use(jwtAuth());

InventoryRoute.route("/")
  .post( controller.createInventory)
  .get(controller.getAllInventory);

InventoryRoute.get("/pagination", controller.getInventoryWithPagination);

InventoryRoute.route("/:id")
  .get(controller.getSingleInventory)
  .put( controller.updateInventory)
  .delete(controller.deleteInventory);

// InventoryRoute.put("/status/:id", controller.updateInventoryStatus);

module.exports = InventoryRoute;
