const { Router } = require("express");
const controller = require("../../modules/calculation/calculation.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const CalculationRoute = Router();

// Uncomment the line below if JWT authentication is required
// CalculationRoute.use(jwtAuth());

CalculationRoute.route("/")
  .post(upload.any(), controller.createCalculation)
  // .get(controller.getAllCalculation)
  .get(controller.getAllCalculationByUser);

CalculationRoute.get("/pagination", controller.getCalculationWithPagination);

CalculationRoute.route("/:id")
  .get(controller.getSingleCalculation)
  .put(upload.any(), controller.updateCalculation)
  .delete(controller.deleteCalculation);

module.exports = CalculationRoute;
