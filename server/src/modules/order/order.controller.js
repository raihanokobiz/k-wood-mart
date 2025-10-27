const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const OrderService = require("./order.service.js");

class OrderController {
  createOrder = withTransaction(async (req, res, next, session) => {
    console.log("-------body for order----",req.body)
    try {
      const {
        // orderId,
        subTotalPrice,
        totalPrice,
        coupon,
        shippingCost,
        userRef,
        customerName,
        customerPhone,
        customerEmail,
        customerCity,
        customerAddress,
        customerHouse,
        customerRoad,
        customerThana,
        customerAltPhone,
        paymentMethod,
        note
      } = req.body;

      const payload = {
        // orderId,
        subTotalPrice,
        totalPrice,
        shippingCost,
        coupon,
        userRef,
        customerName,
        customerPhone,
        customerEmail,
        customerCity,
        customerAddress,
        customerHouse,
        customerRoad,
        customerThana,
        customerAltPhone,
        paymentMethod,
        note
      };

      const orderResult = await OrderService.createOrder(payload, session);
      const resDoc = responseHandler(201, "Order successfully", orderResult);
      res.status(resDoc.statusCode).json(resDoc);
    } catch (error) {
      if (error.message === "OrderId must be unique") {
        const resDoc = responseHandler(400, error.message);
        res.status(resDoc.statusCode).json(resDoc);
      } else {
        next(error);
      }
    }
  });

  createAdminOrder = withTransaction(async (req, res, next, session) => {
    const payload = {
      userRef: req.body.userRef,
      orders: req?.body?.order,
      warehouseRef: req.body.warehouseRef,
      payment: req.body.payment,
      note: req.body.note,
    };
    const orderResult = await OrderService.createAdminOrder(payload, session);
    const resDoc = responseHandler(
      201,
      "Order Created successfully",
      orderResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllOrder = catchError(async (req, res) => {
    const orderResult = await OrderService.getAllOrder();
    const resDoc = responseHandler(200, "Get All Orders", orderResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getOrderWithPagination = catchError(async (req, res) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
      warehouseRef: req.query.warehouseRef,
    };
    const order = await OrderService.getOrderWithPagination(payload);
    const resDoc = responseHandler(200, "Orders get successfully", order);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleOrder = catchError(async (req, res) => {
    const id = req.params.id;
    const orderResult = await OrderService.getSingleOrder(id);
    const resDoc = responseHandler(
      201,
      "Single Order successfully",
      orderResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getUserAllOrder = catchError(async (req, res) => {
    const id = req.params.id;
    const orderResult = await OrderService.getUserAllOrder(id);
    const resDoc = responseHandler(
      201,
      "User All Order get successfully",
      orderResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });
  orderTracking = catchError(async (req, res) => {
    const payload = {
      orderId: req.body.orderId,
    };
    const orderResult = await OrderService.orderTracking(payload);
    const resDoc = responseHandler(
      201,
      "User Order get successfully",
      orderResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateOrder = catchError(async (req, res) => {
    const id = req.params.id;
    // const payloadFiles = {
    //   files: req?.files,
    // };
    const payload = {
      orderId: req.body.orderId,
      subTotal: req.body.subTotal,
      total: req.body.total,
      status: req.body.status,
      coupon: req.body.coupon,
      userRef: req.body.userRef,
    };
    await OrderService.updateOrder(
      id,
      // payloadFiles,
      payload
    );
    const resDoc = responseHandler(201, "Order Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateOrderStatus = withTransaction(async (req, res, next, session) => {
    const id = req.params.id;
    const status = req.body.status;
    await OrderService.updateOrderStatus(id, status, session);
    const resDoc = responseHandler(201, "Order Status Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

    isCourierSending = withTransaction(async (req, res, next, session) => {
    const id = req.params.id;;
    await OrderService.isCourierSending(id, session);
    const resDoc = responseHandler(201, "Order Status Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });


  deleteOrder = withTransaction(async (req, res, next, session) => {
    const id = req.params.id;
    const orderResult = await OrderService.deleteOrder(id, session);
    if (orderResult) {
      const resDoc = responseHandler(200, "Order Deleted successfully");
      res.status(resDoc.statusCode).json(resDoc);
    }
  });
}

module.exports = new OrderController();
