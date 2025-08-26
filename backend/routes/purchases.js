import express from "express";
import Purchase from "../models/Purchase.js";

const router = express.Router();

// Create purchase
// POST /api/purchases
router.post("/", async (req, res) => {
  try {
    const { supplier, amountPurchased, amountPaid, date } = req.body;

    const purchase = new Purchase({
      supplier,
      amountPurchased,
      amountPaid,
      date,
    });

    await purchase.save();
    res.status(201).json(purchase);
  } catch (err) {
    console.error("Error saving purchase:", err);
    res.status(500).json({ error: "Failed to create purchase" });
  }
});

// Get all purchases
// GET /api/purchases
router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .sort({ createdAt: -1 })
      .populate("supplier");
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
});

// Get balances aggregated by supplier
// GET /api/purchases/balances
router.get("/balances", async (req, res) => {
  try {
    const balances = await Purchase.aggregate([
      {
        $group: {
          _id: "$supplier",
          totalPurchased: { $sum: "$amountPurchased" },
          totalPaid: { $sum: "$amountPaid" },
        },
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "_id",
          foreignField: "_id",
          as: "supplier",
        },
      },
      { $unwind: "$supplier" },
      {
        $project: {
          shopName: "$supplier.shopName",
          area: "$supplier.area",
          contactNumber: "$supplier.contactNumber",
          totalPurchased: 1,
          totalPaid: 1,
          balance: { $subtract: ["$totalPurchased", "$totalPaid"] },
        },
      },
    ]);

    res.json(balances);
  } catch (error) {
    console.error("Error calculating balances:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get purchases by supplier
// GET /api/purchases/by-supplier/:id
router.get("/by-supplier/:id", async (req, res) => {
  try {
    const purchases = await Purchase.find({ supplier: req.params.id }).sort({
      date: -1,
    });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: "Error fetching purchases" });
  }
});

export default router;
