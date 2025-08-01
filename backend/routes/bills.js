import express from "express";
// import Bill from "../models/Bill.js";
import Bill from "../models/Bill.js"; // Ensure this path is correct based on your project structure

const router = express.Router();

// Create bill
// POST /api/bills
router.post("/", async (req, res) => {
  try {
    const { customer, amountPurchased, amountGiven, date } = req.body;

    const bill = new Bill({
      customer,
      amountPurchased,
      amountGiven,
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

router.get("/balances",async(req,res)=>{
  try {
    const balances = await Bill.aggregate([
      {
        $group: {
          _id: "$customer",
          totalPurchased: { $sum: "$amountPurchased" },
          totalGiven: { $sum: "$amountGiven" },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $project: {
          shopName: "$customer.shopName",
          area: "$customer.area",
          contactNumber: "$customer.contactNumber",
          totalPurchased: 1,
          totalGiven: 1,
          balance: { $subtract: ["$totalPurchased", "$totalGiven"] },
        },
      },
    ]);

    res.json(balances);
  } catch (error) {
    console.error("Error calculating balances:", error);
    res.status(500).json({ error: "Server error" });
  }


})

router.get("/by-customer/:id", async (req, res) => {
  try {
    const bills = await Bill.find({ customer: req.params.id }).sort({
      date: -1,
    });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: "Error fetching bills" });
  }
});



export default router;
