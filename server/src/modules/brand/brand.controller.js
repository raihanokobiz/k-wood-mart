const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const BrandService = require("./brand.service.js");

class BrandController {
  createBrand = withTransaction(async (req, res, next, session) => {
    console.log(req.body);
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      name: req.body.name,
      slug: req.body.slug,
      status: req.body.status,
    };
    const brandResult = await BrandService.createBrand(
      payloadFiles,
      payload,
      session
    );
    const resDoc = responseHandler(
      201,
      "Brand Created successfully",
      brandResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllBrand = catchError(async (req, res, next) => {
    const brandResult = await BrandService.getAllBrand();
    const resDoc = responseHandler(200, "Get All Brands", brandResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getBrandWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const brand = await BrandService.getBrandWithPagination(payload);
    const resDoc = responseHandler(200, "Brands get successfully", brand);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleBrand = catchError(async (req, res, next) => {
    const id = req.params.id;
    const brandResult = await BrandService.getSingleBrand(id);
    const resDoc = responseHandler(
      201,
      "Single Brand successfully",
      brandResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBrand = catchError(async (req, res, next) => {
    const id = req.params.id;
    const payloadFiles = {
      files: req?.files,
    };
    const payload = {
      name: req.body.name,
      status: req.body.status,
      slug: req.body.slug,
    };
    const brandResult = await BrandService.updateBrand(
      id,
      payloadFiles,
      payload
    );
    const resDoc = responseHandler(201, "Brand Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBrandStatus = catchError(async (req, res, next) => {
    const id = req.params.id;
    const status = req.query.status;
    const brandResult = await BrandService.updateBrandStatus(id, status);
    const resDoc = responseHandler(201, "Brand Status Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteBrand = catchError(async (req, res, next) => {
    const id = req.params.id;
    const brandResult = await BrandService.deleteBrand(id);
    const resDoc = responseHandler(200, "Brand Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new BrandController();
