// models/Customer.js
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    shopName: { type: String, required: true },
    area: { type: String, required: true },
    contactNumber: { type: String, required: true },
    gst: { type: String }, // optional
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
