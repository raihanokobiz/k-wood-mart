const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const WarehouseService = require("./warehouse.service.js");

class WarehouseController {
  createWarehouse = withTransaction(async (req, res, next, session) => {
    console.log(req.body);
    const payload = {
      name: req.body.name,
      location: req.body.location,
      managerRef: req.body.managerRef,
      contact: req.body.contact,
    };
    const warehouseResult = await WarehouseService.createWarehouse(
      payload,
      session
    );
    const resDoc = responseHandler(
      201,
      "Warehouse Created successfully",
      warehouseResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllWarehouse = catchError(async (req, res, next) => {
    const warehouseResult = await WarehouseService.getAllWarehouse();
    const resDoc = responseHandler(200, "Get All Warehouses", warehouseResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getWarehouseWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const warehouse = await WarehouseService.getWarehouseWithPagination(payload);
    const resDoc = responseHandler(200, "Warehouses get successfully", warehouse);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleWarehouse = catchError(async (req, res, next) => {
    const id = req.params.id;
    const warehouseResult = await WarehouseService.getSingleWarehouse(id);
    const resDoc = responseHandler(
      201,
      "Single Warehouse successfully",
      warehouseResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateWarehouse = catchError(async (req, res, next) => {
    const id = req.params.id;
    const payload = {
      name: req.body.name,
      location: req.body.location,
      managerRef: req.body.managerRef,
      contact: req.body.contact,
    };
    const warehouseResult = await WarehouseService.updateWarehouse(
      id,
      payload
    );
    const resDoc = responseHandler(201, "Warehouse Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateWarehouseStatus = catchError(async (req, res, next) => {
    const id = req.params.id;
    const status = req.query.status;
    const warehouseResult = await WarehouseService.updateWarehouseStatus(
      id,
      status
    );
    const resDoc = responseHandler(201, "Warehouse Status Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteWarehouse = catchError(async (req, res, next) => {
    const id = req.params.id;
    const warehouseResult = await WarehouseService.deleteWarehouse(id);
    const resDoc = responseHandler(200, "Warehouse Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new WarehouseController();
