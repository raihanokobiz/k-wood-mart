const { Router } = require("express");
const controller = require("../../modules/contactInfo/contact.info.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const ContactInfoRoute = Router();
// ContactInfoRoute.use(jwtAuth());

ContactInfoRoute.route("/")
  .post(upload.any(), controller.createContactInfo)
  .get(controller.getAllContactInfo);

ContactInfoRoute.get("/pagination", controller.getContactInfoWithPagination);
ContactInfoRoute.route("/:id")
  .get(controller.getSingleContactInfo)
  .put(upload.any(), controller.updateContactInfo)
  .delete(controller.deleteContactInfo);

module.exports = ContactInfoRoute;
