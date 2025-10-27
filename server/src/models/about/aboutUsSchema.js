const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AboutUsschema = new Schema(
  {
    header: {
      type: String,
    },
    title: {
      type: String,
      // unique: true,
    },
    description: {
      type: String,
      // unique: true,
    },
    image: {
      type: String,
    },
    whatsapp: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  { timestamps: true }
);

const AboutUsSchema = mongoose.model("aboutUs", AboutUsschema);

module.exports = { AboutUsSchema };
