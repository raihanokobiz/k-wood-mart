const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Inventoryschema = new Schema(
  {
    productRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    warehouseRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "warehouse",
      // required: true,
    },
    quantity: { type: Number },
    mrpPrice: { type: Number },
    price: { type: Number },
    discountType: {
      type: String,
      enum: ["flat", "percent"],
    },
    discount: { type: Number },
    discountAmount: { type: Number },
    barcode: { type: String },
    availableQuantity: { type: Number },
    soldQuantity: { type: Number, default: 0 },
    holdQuantity: { type: Number, default: 0 },
    inventoryType: { type: String },
    color: { type: String },
    name: { type: String }, // this is color name
    level: { type: String },
    inventoryID: { type: String },
  },
  { timestamps: true }
);

const InventorySchema = mongoose.model("inventory", Inventoryschema);

module.exports = { InventorySchema };
