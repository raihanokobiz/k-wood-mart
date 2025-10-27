const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WarehouseTransferschema = new Schema(
  {
    fromWarehouseRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "warehouse",
      required: true,
    },
    toWarehouseRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "warehouse",
      required: true,
    },
    inventoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "inventory",
      required: true,
    },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Completed", "Reject"], default: "Pending" },
  },
  { timestamps: true }
);

const WarehouseTransferSchema = mongoose.model("warehouseTransfer", WarehouseTransferschema);

module.exports = { WarehouseTransferSchema };
