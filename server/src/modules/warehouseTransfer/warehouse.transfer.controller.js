const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const WarehouseTransferService = require("./warehouse.transfer.service.js");

class WarehouseTransferController {
  createWarehouseTransfer = withTransaction(async (req, res, next, session) => {
    console.log(req.body);
    // const payloadFiles = {
    //   files: req.files,
    // };
    const payload = {
      fromWarehouseRef: req.body.fromWarehouseRef,
      toWarehouseRef: req.body.toWarehouseRef,
      inventoryRefs: req.body.inventoryRefs,
      quantitys: req.body.quantitys,
    };
    const warehouseTransferResult = await WarehouseTransferService.createWarehouseTransfer(payload, session);
    const resDoc = responseHandler(
      201,
      "WarehouseTransfer Created successfully",
      warehouseTransferResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  // getAllWarehouseTransfer = catchError(async (req, res) => {

  //   const warehouseTransferResult = await WarehouseTransferService.getAllWarehouseTransfer();
  //   const resDoc = responseHandler(200, "Get All WarehouseTransfers", warehouseTransferResult);
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  getWarehouseTransferFromWithPagination = catchError(async (req, res) => {
    const idFrom = req.params.id;
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const warehouseTransfer = await WarehouseTransferService.getWarehouseTransferFromWithPagination(idFrom, payload);
    const resDoc = responseHandler(200, "WarehouseTransfers get successfully", warehouseTransfer);
    res.status(resDoc.statusCode).json(resDoc);
  });
  getWarehouseTransferToWithPagination = catchError(async (req, res) => {
    const idTo = req.params.id;
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const warehouseTransfer = await WarehouseTransferService.getWarehouseTransferToWithPagination(idTo, payload);
    const resDoc = responseHandler(200, "WarehouseTransfers get successfully", warehouseTransfer);
    res.status(resDoc.statusCode).json(resDoc);
  });
  // getSingleWarehouseTransfer = catchError(async (req, res) => {
  //   const id = req.params.id;
  //   const warehouseTransferResult = await WarehouseTransferService.getSingleWarehouseTransfer(id);
  //   const resDoc = responseHandler(
  //     201,
  //     "Single WarehouseTransfer successfully",
  //     warehouseTransferResult
  //   );
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  // updateWarehouseTransfer = catchError(async (req, res) => {
  //   const id = req.params.id;
  //   // const payloadFiles = {
  //   //   files: req?.files,
  //   // };
  //   const payload = {
  //     code: req.body.code,
  //     discount: req.body.discount,
  //     useLimit: req.body.useLimit,
  //     used: req.body.used,
  //     startDate: req.body.startDate,
  //     expireDate: req.body.expireDate,
  //     discountType: req.body.discountType,
  //     categoryRef: req.body.categoryRef,
  //     subCategoryRef: req.body.subCategoryRef,
  //     brandRef: req.body.brandRef,
  //   };
  //   await WarehouseTransferService.updateWarehouseTransfer(
  //     id,
  //     // payloadFiles,
  //     payload
  //   );
  //   const resDoc = responseHandler(201, "WarehouseTransfer Update successfully");
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  updateWarehouseTransferStatus = withTransaction(async (req, res,next, session) => {
    const id = req.params.id;
    const payload = {
      status: req.body.status, // 1 for approved, 2 for rejected, 3 for pending,
      warehouseRef: req.body.warehouseRef,
    };
    const warehouseTransfer = await WarehouseTransferService.updateWarehouseTransferStatus(id, payload, session);
    const resDoc = responseHandler(201, "WarehouseTransfer Status Update successfully", warehouseTransfer);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // deleteWarehouseTransfer = catchError(async (req, res) => {
  //   const id = req.params.id;
  //   await WarehouseTransferService.deleteWarehouseTransfer(id);
  //   const resDoc = responseHandler(200, "WarehouseTransfer Deleted successfully");
  //   res.status(resDoc.statusCode).json(resDoc);
  // });

  // calculateWarehouseTransferTotal = catchError(async (req, res, session) => {
  //   const payload = {
  //     userRef: req.body.userRef,
  //     warehouseTransferRef: req.body.warehouseTransferRef,
  //   };
  //   console.log(payload, "payload from calculate warehouseTransfer total");

  //   const warehouseTransferResult = await WarehouseTransferService.calculateWarehouseTransferTotal(
  //     payload,
  //     session
  //   );
  //   const resDoc = responseHandler(
  //     201,
  //     "WarehouseTransfer calculation successfully",
  //     warehouseTransferResult
  //   );
  //   res.status(resDoc.statusCode).json(resDoc);
  // });
}

module.exports = new WarehouseTransferController();
