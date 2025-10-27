const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const RoleService = require("./role.service.js");

class RoleController {

  createRole = withTransaction(async (req, res, next, session) => {
    const payload = {
      role: req?.body?.role,
      permissions: req?.body?.permissions,
    };
    const roleResult = await RoleService.createRole(payload, session);
    const resDoc = responseHandler(201, "Role Created successfully", roleResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllRole = catchError(async (req, res, next) => {
    const roleResult = await RoleService.getAllRole();
    const resDoc = responseHandler(200, "Get All Roles", roleResult);
    res.status(resDoc.statusCode).json(resDoc);
  })

  getRoleWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const role = await RoleService.getRoleWithPagination(payload);
    const resDoc = responseHandler(200, "Roles get successfully", role);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleRole = catchError(async (req, res, next) => {
    const id = req.params.id;
    const permission = req.query.permission
    const roleResult = await RoleService.getSingleRole(id, permission);
    const resDoc = responseHandler(
      201,
      "Single Role successfully",
      roleResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateRole = withTransaction(async (req, res, next, session) => {
    const id = req.params.id;
    console.log("payload", req.body);
    const payload = {
      role: req?.body?.role,
      permissions: req?.body?.permissions,
    };
    const roleResult = await RoleService.updateRole(id, payload, session);
    const resDoc = responseHandler(201, "Role Update successfully", roleResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateRoleStatus = catchError(async (req, res, next) => {
    const id = req.params.id;
    const status = req.query.status;
    const roleResult = await RoleService.updateRoleStatus(id, status);
    const resDoc = responseHandler(201, "Role Status Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteRole = catchError(async (req, res, next) => {
    const id = req.params.id;

    const roleResult = await RoleService.deleteRole(id);
    const resDoc = responseHandler(200, "Role Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new RoleController();

