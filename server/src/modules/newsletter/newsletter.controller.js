const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const NewsletterService = require("./newsletter.service.js");

class NewsletterController {
  createNewsletter = withTransaction(async (req, res, next, session) => {
    const payload = {
      email: req?.body?.email,
    };
    const newsletterResult = await NewsletterService.createNewsletter(
      payload,
      session
    );
    const resDoc = responseHandler(
      201,
      "Newsletter Created successfully",
      newsletterResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllNewsletter = catchError(async (req, res, next) => {
    const newsletterResult = await NewsletterService.getAllNewsletter();
    const resDoc = responseHandler(
      200,
      "Get All Newsletters",
      newsletterResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getNewsletterWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const newsletter = await NewsletterService.getNewsletterWithPagination(
      payload
    );
    const resDoc = responseHandler(
      200,
      "Newsletters get successfully",
      newsletter
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleNewsletter = catchError(async (req, res, next) => {
    const id = req.params.id;
    const newsletterResult = await NewsletterService.getSingleNewsletter(id);
    const resDoc = responseHandler(
      201,
      "Single Newsletter successfully",
      newsletterResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateNewsletter = catchError(async (req, res, next) => {
    const id = req.params.id;
    const { email } = req.body;
    console.log("email", req.body);
    const payload = {
      email,
    };
    const newsletterResult = await NewsletterService.updateNewsletter(
      id,
      payload
    );
    const resDoc = responseHandler(201, "Newsletter Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateNewsletterStatus = catchError(async (req, res, next) => {
    const id = req.params.id;
    const status = req.query.status;
    const newsletterResult = await NewsletterService.updateNewsletterStatus(
      id,
      status
    );
    const resDoc = responseHandler(
      201,
      "Newsletter Status Update successfully"
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteNewsletter = catchError(async (req, res, next) => {
    const id = req.params.id;

    const newsletterResult = await NewsletterService.deleteNewsletter(id);
    const resDoc = responseHandler(200, "Newsletter Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new NewsletterController();
