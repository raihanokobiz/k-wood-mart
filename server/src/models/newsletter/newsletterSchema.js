const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Newsletterschema = new Schema(
  {
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

const NewsletterSchema = mongoose.model("newsletter", Newsletterschema);

module.exports = { NewsletterSchema };
