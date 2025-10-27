const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const BlogTagService = require("./blogTag.service.js");

class BlogTagController {
  createBlogTag = withTransaction(async (req, res, next, session) => {
    const payload = {
      title: req?.body?.title,
    };

    const blogTagResult = await BlogTagService.createBlogTag(payload, session);
    const resDoc = responseHandler(
      201,
      "BlogTag Created successfully",
      blogTagResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllBlogTag = catchError(async (req, res, next) => {
    const blogTagResult = await BlogTagService.getAllBlogTag();
    const resDoc = responseHandler(200, "Get All BlogTags", blogTagResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getBlogTagWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const blogTag = await BlogTagService.getBlogTagWithPagination(payload);
    const resDoc = responseHandler(200, "BlogTags get successfully", blogTag);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleBlogTag = catchError(async (req, res, next) => {
    const id = req.params.id;
    const blogTagResult = await BlogTagService.getSingleBlogTag(id);
    const resDoc = responseHandler(
      201,
      "Single BlogTag successfully",
      blogTagResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBlogTag = catchError(async (req, res, next) => {
    const id = req.params.id;
    const payload = {
      title: req?.body?.title,
    };

    const blogTagResult = await BlogTagService.updateBlogTag(id, payload);
    const resDoc = responseHandler(201, "BlogTag Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteBlogTag = catchError(async (req, res, next) => {
    const id = req.params.id;

    const blogTagResult = await BlogTagService.deleteBlogTag(id);
    const resDoc = responseHandler(200, "BlogTag Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new BlogTagController();
