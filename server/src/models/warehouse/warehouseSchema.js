const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Warehouseschema = new Schema(
  {
    name: { type: String, required: true }, 
    location: { type: String,}, 
    managerRef: { type: Schema.Types.ObjectId, ref: "user" },
    contact: { type: String },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const WarehouseSchema = mongoose.model("warehouse", Warehouseschema);
module.exports = { WarehouseSchema };
