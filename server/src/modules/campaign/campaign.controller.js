const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const CampaignService = require("./campaign.service.js");
const { default: mongoose } = require("mongoose");

class CampaignController {
  // Create a campaign item
  createCampaign = withTransaction(async (req, res, next, session) => {
    const payload = {
      name: req.body.name,
      couponRef: req.body.couponRef,
    };
    const campaignResult = await CampaignService.createCampaign(payload, session);
    const resDoc = responseHandler(
      201,
      "Campaign Created successfully",
      campaignResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllCampaign = catchError(async (req, res) => {
    const campaignResult = await CampaignService.getAllCampaign();
    const resDoc = responseHandler(200, "Get All Campaigns", campaignResult);
    res.status(resDoc.statusCode).json(resDoc);
  });



  getCampaignWithPagination = catchError(async (req, res) => {
    let payload = {
      limit: req.query.limit,
      page: req.query.page,
      order: req.query.order,
    };
    const campaign = await CampaignService.getCampaignWithPagination(payload);
    const resDoc = responseHandler(200, "Campaigns get successfully", campaign);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleCampaign = catchError(async (req, res) => {
    const id = req.params.id;
    const campaignResult = await CampaignService.getSingleCampaign(id);
    const resDoc = responseHandler(201, "Single Campaign successfully", campaignResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateCampaign = catchError(async (req, res) => {
    const id = req.params.id;
    const payload = {
      name: req.body.name,
      couponRef: req.body.couponRef,
    };
    await CampaignService.updateCampaign(id, payload);
    const resDoc = responseHandler(201, "Campaign Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });



  // Delete a campaign item
  deleteCampaign = catchError(async (req, res) => {
    const id = req.params.id;
    await CampaignService.deleteCampaign(id);
    const resDoc = responseHandler(200, "Campaign Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new CampaignController();
