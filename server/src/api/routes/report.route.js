const { Router } = require("express");
const controller = require("../../modules/reports/report.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const ReportRoute = Router();

// Uncomment the line below if JWT authentication is required
// ReportRoute.use(jwtAuth());

ReportRoute.get("/order", controller.getOrderReport);
ReportRoute.get("/profit-loss", controller.getProfitLossReport);
ReportRoute.get("/dashboard-metrics", controller.getDashboardMetrics);

module.exports = ReportRoute;
