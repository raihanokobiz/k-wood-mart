const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Userschema = new Schema(
  {
    userId: {
      type: String,
      // required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // unique: true,
    },
    phone: {
      type: String,
      // unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    roleRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
    },
    warehouseRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "warehouse",
    },
    isFistOrder: {
      type: Boolean,
      default: true,
    },
    orderPlaced: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: String,
    },
    otpTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

const UserSchema = mongoose.model("user", Userschema);

module.exports = { UserSchema };
