import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  TrendingDown,
  TrendingUp,
  Calendar,
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

const SupplierTransactions = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const supplierRes = await axios.get(
          `http://localhost:5001/api/suppliers/${id}`
        );
        const purchasesRes = await axios.get(
          `http://localhost:5001/api/purchases/by-supplier/${id}`
        );
        setSupplier(supplierRes.data);
        setPurchases(purchasesRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch supplier data", err);
        setLoading(false);
      }
    }

    fetchData();
    const onPurchasesUpdated = () => fetchData();
    window.addEventListener("purchases:updated", onPurchasesUpdated);
    return () => window.removeEventListener("purchases:updated", onPurchasesUpdated);
  }, [id]);

  const totalPurchased = purchases.reduce((sum, p) => sum + p.amountPurchased, 0);
  const totalPaid = purchases.reduce((sum, p) => sum + p.amountPaid, 0);
  const netOwed = totalPurchased - totalPaid; // you owe supplier

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="px-6 py-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="p-3 bg-indigo-50 rounded-xl w-[11%] mb-2">
            <TrendingDown className="w-6 h-6 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold ">{formatRupee(totalPurchased)}</p>
          <p className="text-gray-500 text-sm">Total Purchases (from Supplier)</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="p-3 bg-emerald-50 rounded-xl w-[11%]  mb-2">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold ">{formatRupee(totalPaid)}</p>
          <p className="text-gray-500 text-sm">Total Paid to Supplier</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="p-3 bg-red-50 rounded-xl w-[11%]  mb-2">
            <DollarSign className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">
            {formatRupee(netOwed)}
          </p>
          <p className="text-gray-500 text-sm">Outstanding (You Owe)</p>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Purchases */}
        <div className="w-full md:w-1/2 bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold text-gray-900 flex items-center mb-3">
            <ArrowDownLeft className="w-6 h-6 mr-3 text-indigo-600" />
            Purchases
          </h2>
          {purchases.filter(p => p.amountPurchased > 0).length > 0 ? (
            purchases.filter(p => p.amountPurchased > 0).map((p) => (
              <div key={p._id} className="border rounded-md p-4 mb-3 flex justify-between items-center">
                <div className="flex items-center gap-2  font-semibold">
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <ArrowDownLeft className="w-5 h-5 text-indigo-600 " />
                  </div>
                  <span>-{formatRupee(p.amountPurchased)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(p.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No purchases found for this supplier.</p>
          )}
        </div>

        {/* Payments */}
        <div className="w-full md:w-1/2 bg-white rounded-lg p-4 shadow">
          <h2 className="text-xl font-bold text-gray-900 flex items-center mb-3">
            <ArrowUpRight className="w-6 h-6 mr-3 text-emerald-600" />
            Payments
          </h2>
          {purchases.filter(p => p.amountPaid > 0).length > 0 ? (
            purchases.filter(p => p.amountPaid > 0).map((p) => (
              <div key={p._id} className="border rounded-md p-4 mb-3 flex justify-between items-center">
                <div className="flex items-center gap-2  font-semibold">
                  <div className="p-2 rounded-lg bg-green-50 text-emerald-600">
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  </div>
                  <span>+{formatRupee(p.amountPaid)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(p.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No payments found for this supplier.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierTransactions;
