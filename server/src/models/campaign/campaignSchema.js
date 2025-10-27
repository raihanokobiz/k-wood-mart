const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Campaignschema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    couponRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupon",
    },
   
  },
  { timestamps: true }
);

const CampaignSchema = mongoose.model("campaign", Campaignschema);

module.exports = { CampaignSchema };
