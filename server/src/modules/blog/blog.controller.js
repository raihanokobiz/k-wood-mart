const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const BlogService = require("./blog.service.js");

class BlogController {
  createBlog = withTransaction(async (req, res, next, session) => {
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      title: req?.body?.title,
      details: req?.body?.details,
      author: req?.body?.author,
      tags: req?.body?.tags,
      status: req?.body?.status,
    };

    const blogResult = await BlogService.createBlog(
      payload,
      payloadFiles,
      session
    );
    const resDoc = responseHandler(
      201,
      "Blog Created successfully",
      blogResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllBlog = catchError(async (req, res, next) => {
    let payload = {
      tags: req.query.tags,
    };
    const blogResult = await BlogService.getAllBlog(payload);
    const resDoc = responseHandler(200, "Get All Blogs", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getBlogWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const blog = await BlogService.getBlogWithPagination(payload);
    const resDoc = responseHandler(200, "Blogs get successfully", blog);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleBlog = catchError(async (req, res, next) => {
    const slug = req.params.slug;
    const blogResult = await BlogService.getSingleBlog(slug);
    const resDoc = responseHandler(201, "Single Blog successfully", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBlog = catchError(async (req, res, next) => {
    const id = req.params.id;
    console.log("id", id);
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      title: req?.body?.title,
      details: req?.body?.details,
      author: req?.body?.author,
      tags: req?.body?.tags,
      status: req?.body?.status,
    };
    const blogResult = await BlogService.updateBlog(id, payload, payloadFiles);
    const resDoc = responseHandler(201, "Blog Update successfully", blogResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateBlogStatus = catchError(async (req, res, next) => {
    const id = req.params.id;
    const status = req.query.status;
    const blogResult = await BlogService.updateBlogStatus(id, status);
    const resDoc = responseHandler(201, "Blog Status Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteBlog = catchError(async (req, res, next) => {
    const id = req.params.id;

    const blogResult = await BlogService.deleteBlog(id);
    const resDoc = responseHandler(200, "Blog Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new BlogController();
