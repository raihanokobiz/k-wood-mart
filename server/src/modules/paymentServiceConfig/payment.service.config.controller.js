const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const PaymentServiceConfigService = require("./payment.service.config.service.js");

class PaymentServiceConfigController {
  createPaymentServiceConfig = withTransaction(
    async (req, res, next, session) => {
      console.log(req.body);
      // const payloadFiles = {
      //   files: req.files,
      // };
      const payload = {
        serviceMethod: req.body.serviceMethod,
        baseUrl: req.body.baseUrl,
        userName: req.body.userName,
        apiKey: req.body.apiKey,
        secretKey: req.body.secretKey,
        clientKey: req.body.clientKey,
        clientId: req.body.clientId,
        clientSecret: req.body.clientSecret,
        email: req.body.email,
        password: req.body.password,
        grantType: req.body.grantType,
        status: req.body.status,
      };
      const paymentServiceConfigResult =
        await PaymentServiceConfigService.createPaymentServiceConfig(
          // payloadFiles,
          payload,
          session
        );
      const resDoc = responseHandler(
        201,
        "PaymentServiceConfig Created successfully",
        paymentServiceConfigResult
      );
      res.status(resDoc.statusCode).json(resDoc);
    }
  );

  getAllPaymentServiceConfig = catchError(async (req, res, next) => {
    const paymentServiceConfigResult =
      await PaymentServiceConfigService.getAllPaymentServiceConfig();
    const resDoc = responseHandler(
      200,
      "Get All PaymentServiceConfigs",
      paymentServiceConfigResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getPaymentServiceConfigWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const paymentServiceConfig =
      await PaymentServiceConfigService.getPaymentServiceConfigWithPagination(
        payload
      );
    const resDoc = responseHandler(
      200,
      "PaymentServiceConfigs get successfully",
      paymentServiceConfig
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSinglePaymentServiceConfig = catchError(async (req, res, next) => {
    const id = req.params.id;
    const paymentServiceConfigResult =
      await PaymentServiceConfigService.getSinglePaymentServiceConfig(id);
    const resDoc = responseHandler(
      201,
      "Single PaymentServiceConfig successfully",
      paymentServiceConfigResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updatePaymentServiceConfig = catchError(async (req, res, next) => {
    const id = req.params.id;
    // const payloadFiles = {
    //   files: req?.files,
    // };
    const payload = {
      serviceMethod: req.body.serviceMethod,
      baseUrl: req.body.baseUrl,
      userName: req.body.userName,
      apiKey: req.body.apiKey,
      secretKey: req.body.secretKey,
      clientKey: req.body.clientKey,
      clientId: req.body.clientId,
      clientSecret: req.body.clientSecret,
      email: req.body.email,
      password: req.body.password,
      grantType: req.body.grantType,
      status: req.body.status,
    };
    const paymentServiceConfigResult =
      await PaymentServiceConfigService.updatePaymentServiceConfig(
        id,
        // payloadFiles,
        payload
      );
    const resDoc = responseHandler(
      201,
      "PaymentServiceConfig Update successfully"
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updatePaymentServiceConfigStatus = catchError(async (req, res, next) => {
    const id = req.params.id;
    const status = req.query.status;
    const paymentServiceConfigResult =
      await PaymentServiceConfigService.updatePaymentServiceConfigStatus(
        id,
        status
      );
    const resDoc = responseHandler(
      201,
      "PaymentServiceConfig Status Update successfully"
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  deletePaymentServiceConfig = catchError(async (req, res, next) => {
    const id = req.params.id;
    const paymentServiceConfigResult =
      await PaymentServiceConfigService.deletePaymentServiceConfig(id);
    const resDoc = responseHandler(
      200,
      "PaymentServiceConfig Deleted successfully"
    );
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new PaymentServiceConfigController();
