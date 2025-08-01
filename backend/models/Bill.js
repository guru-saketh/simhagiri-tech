import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  amountPurchased: { type: Number, required: true },
  amountGiven: { type: Number, default: 0 },
  // balance: { type: Number },
  date: { type: Date, required: true }, // ✅ Add this line
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Bill", billSchema);
