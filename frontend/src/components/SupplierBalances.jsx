import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Users, Search, Filter } from "lucide-react";

const SupplierBalances = () => {
  const [balances, setBalances] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBalances() {
      try {
        const res = await axios.get("http://localhost:5001/api/purchases/balances");
        console.log(res.data);
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

   const alphabetLetters = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

  const filteredBalances =
    selectedLetter === "All"
      ? balances
      : balances.filter((s) => s.shopName?.toUpperCase().startsWith(selectedLetter));

  return (
    <div className="flex h-[calc(100vh-80px)]">
      {/* Sticky Alphabetical Sidebar */}
      <div className="w-20 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Filter
          </h3>
          <button
            onClick={() => setSelectedLetter("All")}
            className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors mb-2 ${
              selectedLetter === "All"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 space-y-1">
            {alphabetLetters.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedLetter === letter
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Supplier Balance Table */}
      <div className="flex-1 flex flex-col">
        {/* 🔹 Styled Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                {/* You can import a supplier icon or reuse Users */}
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                {selectedLetter === "All"
                  ? "All Suppliers"
                  : `Suppliers: ${selectedLetter}`}
              </h2>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                {filteredBalances.length} suppliers
              </span>
            </div>
            <div className="flex items-center space-x-3">
              {/* Search (UI only, can wire up later) */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
                />
              </div>
              {/* Filter button (UI only) */}
              <button className="flex items-center px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* 🔹 Table Section */}
        <div className="flex-1 overflow-auto bg-white p-6">
          {filteredBalances.length === 0 ? (
            <p className="text-gray-500">
              No suppliers starting with '{selectedLetter}'
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Shop Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Area
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total Purchased
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total Paid
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Balance (You Owe)
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBalances.map((s) => (
                    <tr
                      key={s._id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/supplier/${s._id}`)}
                    >
                      {/* Shop with avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">
                              {s.shopName?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="font-medium text-gray-900">
                            {s.shopName}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4 text-gray-700">
                        <span className="font-mono text-sm">
                          {s.contactNumber}
                        </span>
                      </td>

                      {/* Area */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {s.area}
                        </span>
                      </td>

                      {/* Total Purchased */}
                      <td className="px-6 py-4 text-right font-medium text-gray-900">
                        {formatRupee(s.totalPurchased)}
                      </td>

                      {/* Total Paid */}
                      <td className="px-6 py-4 text-right font-medium text-gray-700">
                        {formatRupee(s.totalPaid)}
                      </td>

                      {/* Balance */}
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-red-600">
                          {formatRupee(s.balance)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="px-6 py-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
;

export default SupplierBalances;
