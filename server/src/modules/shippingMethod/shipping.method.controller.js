const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const ShippingMethodService = require("./shipping.method.service.js");

class ShippingMethodController {
  createShippingMethod = withTransaction(async (req, res, next, session) => {
    console.log(req.body);
    // const payloadFiles = {
    //   files: req.files,
    // };
    const payload = {
      shippingMethod: req.body.shippingMethod,
      rate: req.body.rate,
      status: req.body.status,
    };
    const shippingMethodResult =
      await ShippingMethodService.createShippingMethod(
        // payloadFiles,
        payload,
        session
      );
    const resDoc = responseHandler(
      201,
      "ShippingMethod Created successfully",
      shippingMethodResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllShippingMethod = catchError(async (req, res, next) => {
    const shippingMethodResult =
      await ShippingMethodService.getAllShippingMethod();
    const resDoc = responseHandler(
      200,
      "Get All ShippingMethods",
      shippingMethodResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getShippingMethodWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const shippingMethod =
      await ShippingMethodService.getShippingMethodWithPagination(payload);
    const resDoc = responseHandler(
      200,
      "ShippingMethods get successfully",
      shippingMethod
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleShippingMethod = catchError(async (req, res, next) => {
    const id = req.params.id;
    const shippingMethodResult =
      await ShippingMethodService.getSingleShippingMethod(id);
    const resDoc = responseHandler(
      201,
      "Single ShippingMethod successfully",
      shippingMethodResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateShippingMethod = catchError(async (req, res, next) => {
    const id = req.params.id;
    // const payloadFiles = {
    //   files: req?.files,
    // };
    const payload = {
      shippingMethod: req.body.shippingMethod,
      rate: req.body.rate,
      status: req.body.status,
    };
    const shippingMethodResult =
      await ShippingMethodService.updateShippingMethod(
        id,
        // payloadFiles,
        payload
      );
    const resDoc = responseHandler(201, "ShippingMethod Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateShippingMethodStatus = catchError(async (req, res, next) => {
    const id = req.params.id;
    const status = req.query.status;
    const shippingMethodResult =
      await ShippingMethodService.updateShippingMethodStatus(id, status);
    const resDoc = responseHandler(
      201,
      "ShippingMethod Status Update successfully"
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteShippingMethod = catchError(async (req, res, next) => {
    const id = req.params.id;
    const shippingMethodResult =
      await ShippingMethodService.deleteShippingMethod(id);
    const resDoc = responseHandler(200, "ShippingMethod Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new ShippingMethodController();
