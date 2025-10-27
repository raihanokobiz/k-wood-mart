const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Policyschema = new Schema(
  {
    details: {
      type: String,
      //   required: true,
    },
    type: {
      type: String,
      // unique: true,
    },
  },
  { timestamps: true }
);

const PolicySchema = mongoose.model("policy", Policyschema);

module.exports = { PolicySchema };
