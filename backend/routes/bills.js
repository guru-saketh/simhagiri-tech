import express from "express";
// import Bill from "../models/Bill.js";
import Bill from "../models/Bill.js"; // Ensure this path is correct based on your project structure

const router = express.Router();

// Create bill
// POST /api/bills
router.post("/", async (req, res) => {
  try {
    const { customer, amountPurchased, amountGiven, balance, date } = req.body;

    const bill = new Bill({
      customer,
      amountPurchased,
      amountGiven,
      balance,
      date, // ✅ Store the custom date from frontend
    });

    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    console.error("Error saving bill:", err);
    res.status(500).json({ error: "Failed to create bill" });
  }
});



// Get all bills
// GET /api/bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find()
      .sort({ createdAt: -1 })
      .populate('customer'); // <-- pulls full customer info
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});


export default router;
