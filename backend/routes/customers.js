import express from "express";
import Customer from "../models/Customer.js"; // Ensure this path is correct based on your project structure

const router = express.Router();

router.post("/api/customers", async (req, res) => {
  try {
    const { shopName, area, contactNumber, gst } = req.body;

    const customer = new Customer({ shopName, area, contactNumber, gst });
    await customer.save();

    res.status(201).json({ message: "Customer saved successfully" });
  } catch (error) {
    console.error("Error saving customer:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/api/customers", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
  }
});

export default router;
