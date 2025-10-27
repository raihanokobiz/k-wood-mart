const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const SubChildCategoryService = require("./subChild.category.service.js");

class SubChildCategoryController {
  createSubChildCategory = withTransaction(async (req, res, next, session) => {
    console.log(req.body);
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      name: req.body.name,
      status: req.body.status,
      slug: req.body.slug,
      childCategoryRef: req.body.childCategoryRef,
    };
    const subChildCategoryResult = await SubChildCategoryService.createSubChildCategory(
      payloadFiles,
      payload,
      session
    );
    const resDoc = responseHandler(
      201,
      "SubChildCategory Created successfully",
      subChildCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllSubChildCategory = catchError(async (req, res, next) => {
    const subChildCategoryResult = await SubChildCategoryService.getAllSubChildCategory();
    const resDoc = responseHandler(
      200,
      "Get All SubChildCategorys",
      subChildCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSubChildCategoryWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const subChildCategory = await SubChildCategoryService.getSubChildCategoryWithPagination(
      payload
    );
    const resDoc = responseHandler(
      200,
      "SubChildCategorys get successfully",
      subChildCategory
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleSubChildCategory = catchError(async (req, res, next) => {
    const id = req.params.id;
    const subChildCategoryResult = await SubChildCategoryService.getSingleSubChildCategory(id);
    const resDoc = responseHandler(
      201,
      "Single SubChildCategory successfully",
      subChildCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleSubChildCategoryWithSlug = catchError(async (req, res, next) => {
    const slug = req.params.slug;
    const subChildCategoryResult = await SubChildCategoryService.getSingleSubChildCategoryWithSlug(slug);
    const resDoc = responseHandler(
      201,
      "Single SubChildCategory successfully",
      subChildCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateSubChildCategory = catchError(async (req, res, next) => {
    const id = req.params.id;
    const payloadFiles = {
      files: req?.files,
    };
    const payload = {
      name: req.body.name,
      status: req.body.status,
      slug: req.body.slug,
      childCategoryRef: req.body.childCategoryRef,
    };
    const subChildCategoryResult = await SubChildCategoryService.updateSubChildCategory(
      id,
      payloadFiles,
      payload
    );
    const resDoc = responseHandler(201, "SubChildCategory Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateSubChildCategoryStatus = catchError(async (req, res, next) => {
    const id = req.params.id;
    const status = req.query.status;
    const subChildCategoryResult = await SubChildCategoryService.updateSubChildCategoryStatus(
      id,
      status
    );
    const resDoc = responseHandler(
      201,
      "SubChildCategory Status Update successfully"
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteSubChildCategory = catchError(async (req, res, next) => {
    const id = req.params.id;
    const subChildCategoryResult = await SubChildCategoryService.deleteSubChildCategory(id);
    const resDoc = responseHandler(200, "SubChildCategory Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new SubChildCategoryController();
