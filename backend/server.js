import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Customer from './models/Customer.js';
import billRoutes from './routes/bills.js';
import customerRoutes from './routes/customers.js';
import supplierRoutes from './routes/suppliers.js';
import purchaseRoutes from './routes/purchases.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const port = 5001;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/bills", billRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/dashboard", dashboardRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/customerDB", {
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});