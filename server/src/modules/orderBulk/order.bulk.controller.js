const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const OrderBulkService = require("./order.bulk.service.js");
const { default: mongoose } = require("mongoose");

class OrderBulkController {
  // Create a orderBulk item
  createOrderBulk = withTransaction(async (req, res, next, session) => {
    const payload = {
      name: req.body.name ,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      companyName: req.body.companyName,
      productType: req.body.productType,
      deliveryDate: req.body.deliveryDate,
      quantity: req.body.quantity,
      description: req.body.description,
    };
    const orderBulkResult = await OrderBulkService.createOrderBulk(payload, session);
    const resDoc = responseHandler(
      201,
      "OrderBulk Created successfully",
      orderBulkResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllOrderBulk = catchError(async (req, res) => {
    const orderBulkResult = await OrderBulkService.getAllOrderBulk();
    const resDoc = responseHandler(200, "Get All OrderBulks", orderBulkResult);
    res.status(resDoc.statusCode).json(resDoc);
  });



  getOrderBulkWithPagination = catchError(async (req, res) => {
    let payload = {
      name: req.body.name ,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      companyName: req.body.companyName,
      productType: req.body.productType,
      deliveryDate: req.body.deliveryDate,
      quantity: req.body.quantity,
      description: req.body.description,
    };
    const orderBulk = await OrderBulkService.getOrderBulkWithPagination(payload);
    const resDoc = responseHandler(200, "OrderBulks get successfully", orderBulk);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleOrderBulk = catchError(async (req, res) => {
    const id = req.params.id;
    const orderBulkResult = await OrderBulkService.getSingleOrderBulk(id);
    const resDoc = responseHandler(201, "Single OrderBulk successfully", orderBulkResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateOrderBulk = catchError(async (req, res) => {
    const id = req.params.id;
    const payload = {
      name: req.body.name ,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      companyName: req.body.companyName,
      productType: req.body.productType,
      deliveryDate: req.body.deliveryDate,
      quantity: req.body.quantity,
      description: req.body.description,
    };
    await OrderBulkService.updateOrderBulk(id, payload);
    const resDoc = responseHandler(201, "OrderBulk Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });



  // Delete a orderBulk item
  deleteOrderBulk = catchError(async (req, res) => {
    const id = req.params.id;
    await OrderBulkService.deleteOrderBulk(id);
    const resDoc = responseHandler(200, "OrderBulk Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new OrderBulkController();
