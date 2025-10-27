const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const BannerService = require("./banner.service.js");

class BannerController {
  createBanner = withTransaction(async (req, res, next, session) => {
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      title: req?.body?.title,
      details: req?.body?.details,
      type: req?.body?.type,
      bannerCategory: req?.body?.bannerCategory,
      status: req?.body?.status,
      link: req?.body?.link,
    };
    const bannerResult = await BannerService.createBanner(
      payload,
      payloadFiles,
      session
    );
    const resDoc = responseHandler(
      201,
      "Banner Created successfully",
      bannerResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllBanner = catchError(async (req, res, next) => {
    let payload = {
      type: req.query.type,
    };
    const bannerResult = await BannerService.getAllBanner(payload);
    const resDoc = responseHandler(200, "Get All Banners", bannerResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getBannerWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const banner = await BannerService.getBannerWithPagination(payload);
    const resDoc = responseHandler(200, "Banners get successfully", banner);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleBanner = catchError(async (req, res, next) => {
    const id = req.params.id;
    const bannerResult = await BannerService.getSingleBanner(id);
    const resDoc = responseHandler(
      201,
      "Single Banner successfully",
      bannerResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBanner = catchError(async (req, res, next) => {
    const id = req.params.id;
    console.log("id", id);
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      title: req?.body?.title,
      details: req?.body?.details,
      type: req?.body?.type,
      bannerCategory: req?.body?.bannerCategory,
      status: req?.body?.status,
      link: req?.body?.link,
    };

    console.log({ payload: payload, payloadFiles: payloadFiles });
    const bannerResult = await BannerService.updateBanner(
      id,
      payload,
      payloadFiles
    );
    const resDoc = responseHandler(201, "Banner Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBannerStatus = catchError(async (req, res, next) => {
    const id = req.params.id;
    const status = req.query.status;
    const bannerResult = await BannerService.updateBannerStatus(id, status);
    const resDoc = responseHandler(201, "Banner Status Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteBanner = catchError(async (req, res, next) => {
    const id = req.params.id;

    const bannerResult = await BannerService.deleteBanner(id);
    const resDoc = responseHandler(200, "Banner Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new BannerController();
