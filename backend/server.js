import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Customer from './models/Customer.js';
import billRoutes from './routes/bills.js';
import customerRoutes from './routes/customers.js';

const app = express();
const port = 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // allow requests from Vite dev server
    credentials: true, // allow cookies to be sent
  })
);

app.use("/api/bills", billRoutes);
app.use("/api/customers", customerRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/customerDB", {
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});