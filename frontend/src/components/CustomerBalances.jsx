import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerBalances = () => {
  const [balances, setBalances] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBalances() {
      try {
        const res = await axios.get("http://localhost:5001/api/bills/balances");
        setBalances(res.data);
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    }

    fetchBalances();
    const onBillsUpdated = () => fetchBalances();
    window.addEventListener("bills:updated", onBillsUpdated);
    return () => window.removeEventListener("bills:updated", onBillsUpdated);
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
      : balances.filter((c) =>
          c.shopName?.toUpperCase().startsWith(selectedLetter)
        );

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

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-xl font-semibold mb-3">
          {selectedLetter === "All"
            ? "All Customers"
            : `Customers: ${selectedLetter}`}
        </h2>

        {filteredBalances.length === 0 ? (
          <p className="text-gray-500">
            No customers starting with '{selectedLetter}'
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Area
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Purchased
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Given
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBalances.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/customer/${c._id}`)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {c.shopName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {c.contactNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {c.area}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {formatRupee(c.totalPurchased)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {formatRupee(c.totalGiven)}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm font-semibold ${
                        c.balance <= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatRupee(c.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerBalances;
