const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const CouponService = require("./coupon.service.js");

class CouponController {
  createCoupon = withTransaction(async (req, res, next, session) => {
    console.log(req.body);
    // const payloadFiles = {
    //   files: req.files,
    // };
    const payload = {
      code: req.body.code,
      discount: req.body.discount,
      useLimit: req.body.useLimit,
      used: req.body.used,
      startDate: req.body.startDate,
      expireDate: req.body.expireDate,
      discountType: req.body.discountType,
      categoryRef: req.body.categoryRef,
      subCategoryRef: req.body.subCategoryRef,
      brandRef: req.body.brandRef,
    };
    const couponResult = await CouponService.createCoupon(payload, session);
    const resDoc = responseHandler(
      201,
      "Coupon Created successfully",
      couponResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllCoupon = catchError(async (req, res) => {
    const couponResult = await CouponService.getAllCoupon();
    const resDoc = responseHandler(200, "Get All Coupons", couponResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getCouponWithPagination = catchError(async (req, res) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const coupon = await CouponService.getCouponWithPagination(payload);
    const resDoc = responseHandler(200, "Coupons get successfully", coupon);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleCoupon = catchError(async (req, res) => {
    const id = req.params.id;
    const couponResult = await CouponService.getSingleCoupon(id);
    const resDoc = responseHandler(
      201,
      "Single Coupon successfully",
      couponResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateCoupon = catchError(async (req, res) => {
    const id = req.params.id;
    // const payloadFiles = {
    //   files: req?.files,
    // };
    const payload = {
      code: req.body.code,
      discount: req.body.discount,
      useLimit: req.body.useLimit,
      used: req.body.used,
      startDate: req.body.startDate,
      expireDate: req.body.expireDate,
      discountType: req.body.discountType,
      categoryRef: req.body.categoryRef,
      subCategoryRef: req.body.subCategoryRef,
      brandRef: req.body.brandRef,
    };
    await CouponService.updateCoupon(
      id,
      // payloadFiles,
      payload
    );
    const resDoc = responseHandler(201, "Coupon Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateCouponStatus = catchError(async (req, res) => {
    const id = req.params.id;
    const status = req.query.status;
    await CouponService.updateCouponStatus(id, status);
    const resDoc = responseHandler(201, "Coupon Status Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteCoupon = catchError(async (req, res) => {
    const id = req.params.id;
    await CouponService.deleteCoupon(id);
    const resDoc = responseHandler(200, "Coupon Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  calculateCouponTotal = catchError(async (req, res, session) => {
    const payload = {
      userRef: req.body.userRef,
      couponRef: req.body.couponRef,
    };
    console.log(payload, "payload from calculate coupon total");

    const couponResult = await CouponService.calculateCouponTotal(
      payload,
      session
    );
    const resDoc = responseHandler(
      201,
      "Coupon calculation successfully",
      couponResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new CouponController();
