const { Router } = require("express");
const controller = require("../../modules/paymentServiceConfig/payment.service.config.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const PaymentServiceConfigRoute = Router();

// Uncomment the line below if JWT authentication is required
// PaymentServiceConfigRoute.use(jwtAuth());

PaymentServiceConfigRoute.route("/")
  .post(upload.any(), controller.createPaymentServiceConfig)
  .get(controller.getAllPaymentServiceConfig);

PaymentServiceConfigRoute.get(
  "/pagination",
  controller.getPaymentServiceConfigWithPagination
);

PaymentServiceConfigRoute.route("/:id")
  .get(controller.getSinglePaymentServiceConfig)
  .put(upload.any(), controller.updatePaymentServiceConfig)
  .delete(controller.deletePaymentServiceConfig);

PaymentServiceConfigRoute.put(
  "/status/:id",
  controller.updatePaymentServiceConfigStatus
);

module.exports = PaymentServiceConfigRoute;
