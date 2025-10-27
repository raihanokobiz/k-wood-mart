const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const ReportService = require("./report.service.js");

class ReportController {
  getOrderReport = catchError(async (req, res, next) => {
    const payload = {
      duration: req.query.duration,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    console.log("payload", payload);
    const ReportResult = await ReportService.getOrderReport(payload);
    const resDoc = responseHandler(200, "Get All Reports", ReportResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getProfitLossReport = catchError(async (req, res, next) => {
    const payload = {
      warehouseRef: req.query.warehouseRef,
      duration: req.query.duration,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    console.log("payload", payload);
    const ReportResult = await ReportService.getProfitLossReport(payload);
    const resDoc = responseHandler(200, "Get All Reports", ReportResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getDashboardMetrics = catchError(async (req, res, next) => {
    const metrics = await ReportService.getDashboardMetrics();
    const resDoc = responseHandler(200, "Dashboard Metrics Retrieved", metrics);
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new ReportController();
