const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const UserService = require("./user.service.js");

class UserController {
  createUser = withTransaction(async (req, res, next, session) => {
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      name: req?.body?.name,
      email: req?.body?.email,
      phone: req?.body?.phone,
      password: req?.body?.password,
      address: req?.body?.address,
      state: req?.body?.state,
      city: req?.body?.city,
      roleRef: req?.body?.roleRef,
      warehouseRef: req?.body?.warehouseRef,
    };
    const userResult = await UserService.createUser(
      payload,
      payloadFiles,
      session
    );
    const resDoc = responseHandler(
      201,
      "User Created successfully",
      userResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllUser = catchError(async (req, res, next) => {
    const userResult = await UserService.getAllUser();
    const resDoc = responseHandler(200, "Get All Users", userResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getUserWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const user = await UserService.getUserWithPagination(payload);
    const resDoc = responseHandler(200, "Users get successfully", user);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleUser = catchError(async (req, res, next) => {
    const id = req.params.id;
    const userResult = await UserService.getSingleUser(id);
    const resDoc = responseHandler(201, "Single User successfully", userResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateUser = withTransaction(async (req, res, next, session) => {
    const id = req.params.id;
    console.log("id", id);
    const payloadFiles = {
      files: req?.files,
    };
    const payload = {
      name: req?.body?.name,
      email: req?.body?.email,
      phone: req?.body?.phone,
      password: req?.body?.password,
      address: req?.body?.address,
      state: req?.body?.state,
      city: req?.body?.city,
      roleRef: req?.body?.roleRef,
      warehouseRef: req?.body?.warehouseRef,
    };
    const userResult = await UserService.updateUser(id, payload, payloadFiles, session);
    const resDoc = responseHandler(201, "User Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateUserStatus = catchError(async (req, res, next) => {
    const id = req.params.id;
    const status = req.query.status;
    const userResult = await UserService.updateUserStatus(id, status);
    const resDoc = responseHandler(201, "User Status Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteUser = catchError(async (req, res, next) => {
    const id = req.params.id;

    const userResult = await UserService.deleteUser(id);
    const resDoc = responseHandler(200, "User Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new UserController();
