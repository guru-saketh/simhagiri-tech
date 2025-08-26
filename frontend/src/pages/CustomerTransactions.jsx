import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  TrendingDown,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  CreditCard,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

const formatRupee = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const CustomerTransactions = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const customerRes = await axios.get(
          `http://localhost:5001/api/customers/${id}`
        );
        const billsRes = await axios.get(
          `http://localhost:5001/api/bills/by-customer/${id}`
        );
        setCustomer(customerRes.data);
        setBills(billsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setLoading(false);
      }
    }

    fetchData();
    const onBillsUpdated = () => fetchData();
    window.addEventListener("bills:updated", onBillsUpdated);
    return () => window.removeEventListener("bills:updated", onBillsUpdated);
  }, [id]);

  const purchases = bills.filter((b) => b.amountPurchased > 0);
  const payments = bills.filter((b) => b.amountGiven > 0);

  const totalPurchases = purchases.reduce(
    (sum, b) => sum + b.amountPurchased,
    0
  );
  const totalPayments = payments.reduce((sum, b) => sum + b.amountGiven, 0);
  const netFlow = totalPurchases - totalPayments;

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="px-6 py-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="p-3 bg-red-50 rounded-xl w-[11%] mb-2">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-2xl font-bold ">{formatRupee(totalPurchases)}</p>
          <p className="text-gray-500 text-sm">Total Purchases</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="p-3 bg-emerald-50 rounded-xl w-[11%]  mb-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold ">{formatRupee(totalPayments)}</p>
          <p className="text-gray-500 text-sm">Total Payments</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="p-3 bg-indigo-50 rounded-xl w-[11%]  mb-2">
            <DollarSign className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">
            {formatRupee(netFlow)}
          </p>
          <p className="text-gray-500 text-sm">Net Flow</p>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Purchases */}
        <div className="w-full md:w-1/2 bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold text-gray-900 flex items-center mb-3">
            <ShoppingBag className="w-6 h-6 mr-3 text-red-600" />
            Purchases
          </h2>
          {purchases.length > 0 ? (
            purchases.map((bill) => (
              <div
                key={bill._id}
                className="border rounded-md p-4 mb-3 flex justify-between items-center"
              >
                <div className="flex items-center gap-2  font-semibold">
                  <div className="bg-red-50 p-2 rounded-lg">
                    <ArrowDownLeft className="w-5 h-5 text-red-600 " />
                  </div>
                  <span>-{formatRupee(bill.amountPurchased)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(bill.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No purchases found for this customer.
            </p>
          )}
        </div>

        {/* Payments */}
        <div className="w-full md:w-1/2 bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold text-gray-900 flex items-center mb-3">
            <CreditCard className="w-6 h-6 mr-3 text-emerald-600" />
            Payments
          </h2>
          {payments.length > 0 ? (
            payments.map((bill) => (
              <div
                key={bill._id}
                className="border rounded-md p-4 mb-3 flex justify-between items-center"
              >
                <div className="flex items-center gap-2  font-semibold">
                  <div className="p-2 rounded-lg bg-green-50 text-emerald-600">
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  </div>
                  <span>+{formatRupee(bill.amountGiven)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(bill.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No payments found for this customer.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerTransactions;
