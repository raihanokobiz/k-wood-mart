const { Router } = require("express");
const controller = require("../../modules/coupon/coupon.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const CouponRoute = Router();

// Uncomment the line below if JWT authentication is required
// CouponRoute.use(jwtAuth());

CouponRoute.route("/")
  .post(upload.any(), controller.createCoupon)
  .get(controller.getAllCoupon);
CouponRoute.route("/calculate").post(
  upload.any(),
  controller.calculateCouponTotal
);

CouponRoute.get("/pagination", controller.getCouponWithPagination);

// CouponRoute.post("/calculate", controller.calculateCouponTotal);

CouponRoute.route("/:id")
  .get(controller.getSingleCoupon)
  .put(upload.any(), controller.updateCoupon)
  .delete(controller.deleteCoupon);

CouponRoute.put("/status/:id", controller.updateCouponStatus);

module.exports = CouponRoute;
