const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const ChildCategoryService = require("./child.category.service.js");

class ChildCategoryController {
  createChildCategory = withTransaction(async (req, res, next, session) => {
    console.log(req.body);
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      name: req.body.name,
      status: req.body.status,
      slug: req.body.slug,
      viewType: req.body.viewType,
      subCategoryRef: req.body.subCategoryRef,
    };
    const childCategoryResult = await ChildCategoryService.createChildCategory(
      payloadFiles,
      payload,
      session
    );
    const resDoc = responseHandler(
      201,
      "ChildCategory Created successfully",
      childCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllChildCategory = catchError(async (req, res, next) => {
    const payload = {
      viewType: req.query.viewType,
      limit: req.query.limit,
    };
    const childCategoryResult = await ChildCategoryService.getAllChildCategory(payload);
    const resDoc = responseHandler(
      200,
      "Get All ChildCategorys",
      childCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getChildCategoryWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const childCategory = await ChildCategoryService.getChildCategoryWithPagination(
      payload
    );
    const resDoc = responseHandler(
      200,
      "ChildCategorys get successfully",
      childCategory
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleChildCategory = catchError(async (req, res, next) => {
    const id = req.params.id;
    const childCategoryResult = await ChildCategoryService.getSingleChildCategory(id);
    const resDoc = responseHandler(
      201,
      "Single ChildCategory successfully",
      childCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleChildCategoryWithSlug = catchError(async (req, res, next) => {
    const slug = req.params.slug;
    const childCategoryResult = await ChildCategoryService.getSingleChildCategoryWithSlug(slug);
    const resDoc = responseHandler(
      201,
      "Single ChildCategory successfully",
      childCategoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateChildCategory = withTransaction(async (req, res, next, session) => {
    const id = req.params.id;
    const payloadFiles = {
      files: req?.files,
    };
    const payload = {
      name: req.body.name,
      status: req.body.status,
      viewType: req.body.viewType,
      subCategoryRef: req.body.subCategoryRef,
    };
    const childCategoryResult = await ChildCategoryService.updateChildCategory(
      id,
      payloadFiles,
      payload,
      session
    );
    const resDoc = responseHandler(201, "ChildCategory Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateChildCategoryStatus = catchError(async (req, res, next) => {
    const id = req.params.id;
    const status = req.query.status;
    const childCategoryResult = await ChildCategoryService.updateChildCategoryStatus(
      id,
      status
    );
    const resDoc = responseHandler(
      201,
      "ChildCategory Status Update successfully"
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteChildCategory = catchError(async (req, res, next) => {
    const id = req.params.id;
    const childCategoryResult = await ChildCategoryService.deleteChildCategory(id);
    const resDoc = responseHandler(200, "ChildCategory Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new ChildCategoryController();
