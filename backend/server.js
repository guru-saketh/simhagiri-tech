import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Customer from './models/Customer.js';

const app = express();
const port = 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // allow requests from Vite dev server
    credentials: true, // allow cookies to be sent
  })
);

mongoose
  .connect("mongodb://127.0.0.1:27017/customerDB", {
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.post("/api/customers", async(req, res) => {
    try {
      const { shopName, area, contactNumber, gst } = req.body;

      const customer = new Customer({ shopName, area, contactNumber, gst });
      await customer.save();

      res.status(201).json({ message: "Customer saved successfully" });
    } catch (error) {
      console.error("Error saving customer:", error);
      res.status(500).json({ error: "Server Error" });
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});