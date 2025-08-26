// models/Supplier.js
import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true },
    area: { type: String, required: true },
    contactNumber: { type: String, required: true },
    gst: { type: String }, // optional
  },
  { timestamps: true }
);

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;
