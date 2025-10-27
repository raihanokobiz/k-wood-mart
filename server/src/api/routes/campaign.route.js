const { Router } = require("express");
const controller = require("../../modules/campaign/campaign.controller.js");
// const jwtAuth = require("../../middleware/auth/jwtAuth.js");
const { upload } = require("../../middleware/upload/upload.js");

const CampaignRoute = Router();

// Uncomment the line below if JWT authentication is required
// CampaignRoute.use(jwtAuth());

CampaignRoute.route("/")
  .post( controller.createCampaign)
  .get(controller.getAllCampaign);


CampaignRoute.get("/pagination", controller.getCampaignWithPagination);

CampaignRoute.route("/:id")
  .get(controller.getSingleCampaign)
  .put( controller.updateCampaign)
  .delete(controller.deleteCampaign);

module.exports = CampaignRoute;
