import express from 'express';
const router = express.Router();
import Bill from '../models/Bill.js';
import Purchase from '../models/Purchase.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';

// Get monthly sales data (bills)
router.get('/monthly-sales', async (req, res) => {
  try {
    const monthlySales = await Bill.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          totalSales: { $sum: "$amountPurchased" },
          totalReceived: { $sum: "$amountGiven" },
          billCount: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalSales: 1,
          totalReceived: 1,
          billCount: 1,
          outstandingAmount: { $subtract: ["$totalSales", "$totalReceived"] }
        }
      }
    ]);
    res.json(monthlySales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get monthly purchases data
router.get('/monthly-purchases', async (req, res) => {
  try {
    const monthlyPurchases = await Purchase.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          totalPurchases: { $sum: "$amountPurchased" },
          totalPaid: { $sum: "$amountPaid" },
          purchaseCount: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalPurchases: 1,
          totalPaid: 1,
          purchaseCount: 1,
          outstandingAmount: { $subtract: ["$totalPurchases", "$totalPaid"] }
        }
      }
    ]);
    res.json(monthlyPurchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get key metrics summary
router.get('/summary', async (req, res) => {
  try {
    // Total outstanding from customers
    const customerOutstanding = await Bill.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$amountPurchased" },
          totalReceived: { $sum: "$amountGiven" }
        }
      }
    ]);

    // Total outstanding to suppliers
    const supplierOutstanding = await Purchase.aggregate([
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: "$amountPurchased" },
          totalPaid: { $sum: "$amountPaid" }
        }
      }
    ]);

    // Current month sales
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const thisMonthSales = await Bill.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$date" }, currentMonth] },
              { $eq: [{ $year: "$date" }, currentYear] }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$amountPurchased" },
          totalReceived: { $sum: "$amountGiven" },
          billCount: { $sum: 1 }
        }
      }
    ]);

    // Current month purchases
    const thisMonthPurchases = await Purchase.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: "$date" }, currentMonth] },
              { $eq: [{ $year: "$date" }, currentYear] }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: "$amountPurchased" },
          totalPaid: { $sum: "$amountPaid" },
          purchaseCount: { $sum: 1 }
        }
      }
    ]);

    // Active customers and suppliers count
    const activeCustomers = await Customer.countDocuments();
    const activeSuppliers = await Supplier.countDocuments();

    const summary = {
      customerOutstanding: customerOutstanding[0] || { totalSales: 0, totalReceived: 0 },
      supplierOutstanding: supplierOutstanding[0] || { totalPurchases: 0, totalPaid: 0 },
      thisMonthSales: thisMonthSales[0] || { totalSales: 0, totalReceived: 0, billCount: 0 },
      thisMonthPurchases: thisMonthPurchases[0] || { totalPurchases: 0, totalPaid: 0, purchaseCount: 0 },
      activeCustomers,
      activeSuppliers
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top customers by sales
router.get('/top-customers', async (req, res) => {
  try {
    const topCustomers = await Bill.aggregate([
      {
        $lookup: {
          from: 'customers',
          localField: 'customer',
          foreignField: '_id',
          as: 'customerInfo'
        }
      },
      {
        $unwind: '$customerInfo'
      },
      {
        $group: {
          _id: '$customer',
          shopName: { $first: '$customerInfo.shopName' },
          totalSales: { $sum: '$amountPurchased' },
          totalReceived: { $sum: '$amountGiven' },
          billCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalSales: -1 }
      },
      {
        $limit: 5
      }
    ]);
    res.json(topCustomers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top suppliers by purchases
router.get('/top-suppliers', async (req, res) => {
  try {
    const topSuppliers = await Purchase.aggregate([
      {
        $lookup: {
          from: 'suppliers',
          localField: 'supplier',
          foreignField: '_id',
          as: 'supplierInfo'
        }
      },
      {
        $unwind: '$supplierInfo'
      },
      {
        $group: {
          _id: '$supplier',
          shopName: { $first: '$supplierInfo.shopName' },
          totalPurchases: { $sum: '$amountPurchased' },
          totalPaid: { $sum: '$amountPaid' },
          purchaseCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalPurchases: -1 }
      },
      {
        $limit: 5
      }
    ]);
    res.json(topSuppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
