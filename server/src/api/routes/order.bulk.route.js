const { Router } = require("express");
const controller = require("../../modules/orderBulk/order.bulk.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const OrderBulkRoute = Router();

// Uncomment the line below if JWT authentication is required
// OrderBulkRoute.use(jwtAuth());

OrderBulkRoute.route("/")
  .post( controller.createOrderBulk)
  .get(controller.getAllOrderBulk);


OrderBulkRoute.get("/pagination", controller.getOrderBulkWithPagination);

OrderBulkRoute.route("/:id")
  .get(controller.getSingleOrderBulk)
  .put( controller.updateOrderBulk)
  .delete(controller.deleteOrderBulk);

module.exports = OrderBulkRoute;
