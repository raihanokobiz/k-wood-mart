const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactInfoschema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      // unique: true,
    },
    phone: {
      type: String,
      // unique: true,
    },
    subject: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

const ContactInfoSchema = mongoose.model("contactInfo", ContactInfoschema);

module.exports = { ContactInfoSchema };
