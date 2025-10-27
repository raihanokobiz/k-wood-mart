const { Router } = require("express");
const controller = require("../../modules/order/order.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const OrderRoute = Router();

// Uncomment the line below if JWT authentication is required
// OrderRoute.use(jwtAuth());

OrderRoute.route("/")
  .post(upload.any(), controller.createOrder)
  .get(controller.getAllOrder);

OrderRoute.route("/admin").post(controller.createAdminOrder)
OrderRoute.route("/user/:id").get(controller.getUserAllOrder)
OrderRoute.route("/track").get(controller.orderTracking);

OrderRoute.get("/pagination", controller.getOrderWithPagination);

OrderRoute.route("/:id")
  .get(controller.getSingleOrder)
  .put(upload.any(), controller.updateOrder)
  .delete(controller.deleteOrder);

OrderRoute.put("/status/:id", controller.updateOrderStatus);
OrderRoute.put("/couriersend/:id", controller.isCourierSending); 

module.exports = OrderRoute;
