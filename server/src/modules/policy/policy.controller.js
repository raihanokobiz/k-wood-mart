const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const PolicyService = require("./policy.service.js");

class PolicyController {
  createPolicy = withTransaction(async (req, res, next, session) => {
    console.log(req.body);
    // const payloadFiles = {
    //   files: req.files,
    // };
    const payload = {
      details: req.body.details,
      type: req.body.type,
    };
    const policyResult = await PolicyService.createPolicy(
      // payloadFiles,
      payload,
      session
    );
    const resDoc = responseHandler(
      201,
      "Policy Created successfully",
      policyResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllPolicy = catchError(async (req, res, next) => {
    const policyResult = await PolicyService.getAllPolicy();
    const resDoc = responseHandler(200, "Get All Policys", policyResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getPolicyWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const policy = await PolicyService.getPolicyWithPagination(payload);
    const resDoc = responseHandler(200, "Policys get successfully", policy);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSinglePolicy = catchError(async (req, res, next) => {
    const id = req.params.id;
    const policyResult = await PolicyService.getSinglePolicy(id);
    const resDoc = responseHandler(
      201,
      "Single Policy successfully",
      policyResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updatePolicy = catchError(async (req, res, next) => {
    const id = req.params.id;
    // const payloadFiles = {
    //   files: req?.files,
    // };
    const payload = {
      details: req.body.details,
      type: req.body.type,
    };
    const policyResult = await PolicyService.updatePolicy(
      id,
      // payloadFiles,
      payload
    );
    const resDoc = responseHandler(201, "Policy Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  updatePolicyStatus = catchError(async (req, res, next) => {
    const id = req.params.id;
    const status = req.query.status;
    const policyResult = await PolicyService.updatePolicyStatus(id, status);
    const resDoc = responseHandler(201, "Policy Status Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  deletePolicy = catchError(async (req, res, next) => {
    const id = req.params.id;
    const policyResult = await PolicyService.deletePolicy(id);
    const resDoc = responseHandler(200, "Policy Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new PolicyController();
