import express from "express";
import Supplier from "../models/Supplier.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { shopName, area, contactNumber, gst } = req.body;

    const supplier = new Supplier({ shopName, area, contactNumber, gst });
    await supplier.save();

    res.status(201).json({ message: "Supplier saved successfully" });
  } catch (error) {
    console.error("Error saving supplier:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: "Supplier not found" });
  }
});

export default router;
