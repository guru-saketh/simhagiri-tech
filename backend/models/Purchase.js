import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  amountPurchased: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Purchase", purchaseSchema);
