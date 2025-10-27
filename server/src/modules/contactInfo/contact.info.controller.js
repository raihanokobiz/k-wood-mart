const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const ContactInfoService = require("./contact.info.service.js");

class ContactInfoController {
  createContactInfo = withTransaction(async (req, res, next, session) => {
    // const payloadFiles = {
    //   files: req.files,
    // };
    const payload = {
      name: req?.body?.name,
      message: req?.body?.message,
      subject: req?.body?.subject,
      email: req?.body?.email,
      phone: req?.body?.phone,
      whatsapp: req?.body?.whatsapp,
    };
    const contactInfoResult = await ContactInfoService.createContactInfo(
      payload,
      // payloadFiles,
      session
    );
    const resDoc = responseHandler(
      201,
      "ContactInfo Created successfully",
      contactInfoResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllContactInfo = catchError(async (req, res, next) => {
    const contactInfoResult = await ContactInfoService.getAllContactInfo();
    const resDoc = responseHandler(
      200,
      "Get All ContactInfos",
      contactInfoResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getContactInfoWithPagination = catchError(async (req, res, next) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    console.log("kjfhalksjdf fhalks");
    const contactInfo = await ContactInfoService.getContactInfoWithPagination(
      payload
    );
    const resDoc = responseHandler(
      200,
      "ContactInfos get successfully",
      contactInfo
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleContactInfo = catchError(async (req, res, next) => {
    const id = req.params.id;
    const contactInfoResult = await ContactInfoService.getSingleContactInfo(id);
    const resDoc = responseHandler(
      201,
      "Single ContactInfo successfully",
      contactInfoResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateContactInfo = withTransaction(async (req, res, next, session) => {
    const id = req.params.id;
    // const payloadFiles = {
    //   files: req.files,
    // };
    const payload = {
      name: req?.body?.name,
      message: req?.body?.message,
      subject: req?.body?.subject,
      email: req?.body?.email,
      phone: req?.body?.phone,
      whatsapp: req?.body?.whatsapp,
    };
    const contactInfoResult = await ContactInfoService.updateContactInfo(
      id,
      payload,
      // payloadFiles,
      session
    );
    const resDoc = responseHandler(
      201,
      "ContactInfo Update successfully",
      contactInfoResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteContactInfo = catchError(async (req, res, next) => {
    const id = req.params.id;

    const contactInfoResult = await ContactInfoService.deleteContactInfo(id);
    const resDoc = responseHandler(200, "ContactInfo Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new ContactInfoController();
