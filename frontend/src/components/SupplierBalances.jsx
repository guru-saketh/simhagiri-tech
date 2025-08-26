import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SupplierBalances = () => {
  const [balances, setBalances] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBalances() {
      try {
        const res = await axios.get("http://localhost:5001/api/purchases/balances");
        setBalances(res.data);
      } catch (error) {
        console.error("Error fetching supplier balances:", error);
      }
    }
    fetchBalances();
    const onPurchasesUpdated = () => fetchBalances();
    window.addEventListener("purchases:updated", onPurchasesUpdated);
    return () => window.removeEventListener("purchases:updated", onPurchasesUpdated);
  }, []);

  const formatRupee = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

  const filteredBalances =
    selectedLetter === "All"
      ? balances
      : balances.filter((s) => s.shopName?.toUpperCase().startsWith(selectedLetter));

  return (
    <div className="flex p-4 gap-4">
      {/* Sidebar A–Z */}
      <div className="w-20 rounded-lg border bg-white shadow-sm">
        <ul className="divide-y">
          <li>
            <button
              className={`w-full px-3 py-2 text-sm font-semibold ${
                selectedLetter === "All" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
              }`}
              onClick={() => setSelectedLetter("All")}
            >
              All
            </button>
          </li>
          {alphabet.map((letter) => (
            <li key={letter}>
              <button
                className={`w-full px-3 py-2 text-sm ${
                  selectedLetter === letter
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedLetter(letter)}
              >
                {letter}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Supplier Balance Table */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-3">
          {selectedLetter === "All" ? "All Suppliers" : `Suppliers: ${selectedLetter}`}
        </h2>

        {filteredBalances.length === 0 ? (
          <p className="text-gray-500">No suppliers starting with '{selectedLetter}'</p>
        ) : (
          <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchased</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Paid</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance (You Owe)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBalances.map((s) => (
                  <tr
                    key={s._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/supplier/${s._id}`)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-800">{s.shopName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.contactNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.area}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{formatRupee(s.totalPurchased)}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{formatRupee(s.totalPaid)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-red-600">{formatRupee(s.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
;

export default SupplierBalances;
