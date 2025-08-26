import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, ShoppingCart, TrendingUp, TrendingDown, BarChart3, Crown, FileText } from "lucide-react";

const currency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

const monthLabel = (y, m) => new Date(y, m - 1, 1).toLocaleString("en-IN", { month: "short" });

const pctChange = (current, prev) => {
  if (!prev && prev !== 0) {
    return null;
  }
  if (prev === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - prev) / Math.abs(prev)) * 100);
};

const MetricCard = ({ title, value, sub, iconBg, icon, change }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>{icon}</div>
    <div className="flex-1">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="mt-1 flex items-center gap-2">
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        {typeof change === "number" && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
            change >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      {sub && <div className="mt-1 text-xs text-gray-400">{sub}</div>}
    </div>
  </div>
);

const ChartCard = ({ title, badge = "Last 12 months" }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="mb-3 flex items-center justify-between">
      <div className="text-sm font-medium text-gray-800">{title}</div>
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{badge}</span>
    </div>
    <div className="flex h-56 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
      <div className="flex flex-col items-center text-center">
        <BarChart3 className="text-gray-300" size={28} />
        <div className="mt-2 text-sm">Chart will appear here</div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [monthlyPurchases, setMonthlyPurchases] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topSuppliers, setTopSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [sum, sal, pur, tc, ts] = await Promise.all([
          axios.get("http://localhost:5001/api/dashboard/summary"),
          axios.get("http://localhost:5001/api/dashboard/monthly-sales"),
          axios.get("http://localhost:5001/api/dashboard/monthly-purchases"),
          axios.get("http://localhost:5001/api/dashboard/top-customers"),
          axios.get("http://localhost:5001/api/dashboard/top-suppliers"),
        ]);
        setSummary(sum.data);
        setMonthlySales(
          (sal.data || []).slice(-12).map((d) => ({
            label: monthLabel(d.year, d.month),
            total: d.totalSales || 0,
            received: d.totalReceived || 0,
            outstanding: (d.totalSales || 0) - (d.totalReceived || 0),
          }))
        );
        setMonthlyPurchases(
          (pur.data || []).slice(-12).map((d) => ({
            label: monthLabel(d.year, d.month),
            total: d.totalPurchases || 0,
            paid: d.totalPaid || 0,
            outstanding: (d.totalPurchases || 0) - (d.totalPaid || 0),
          }))
        );
        setTopCustomers(tc.data || []);
        setTopSuppliers(ts.data || []);
      } catch (e) {
        console.error("Dashboard fetch error", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();

    const refresh = () => fetchAll();
    window.addEventListener("bills:updated", refresh);
    window.addEventListener("purchases:updated", refresh);
    return () => {
      window.removeEventListener("bills:updated", refresh);
      window.removeEventListener("purchases:updated", refresh);
    };
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading dashboard…</div>;
  }

  const custOutstanding = (summary?.customerOutstanding?.totalSales || 0) - (summary?.customerOutstanding?.totalReceived || 0);
  const suppOutstanding = (summary?.supplierOutstanding?.totalPurchases || 0) - (summary?.supplierOutstanding?.totalPaid || 0);

  const salesNow = monthlySales[monthlySales.length - 1]?.total || 0;
  const salesPrev = monthlySales[monthlySales.length - 2]?.total;
  const purchasesNow = monthlyPurchases[monthlyPurchases.length - 1]?.total || 0;
  const purchasesPrev = monthlyPurchases[monthlyPurchases.length - 2]?.total;

  return (
    <div className="bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Metric cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Outstanding (Customers)"
            value={currency(custOutstanding)}
            iconBg="bg-blue-100 text-blue-700"
            icon={<Users size={20} />}
          />
          <MetricCard
            title="Amount You Owe (Suppliers)"
            value={currency(suppOutstanding)}
            iconBg="bg-red-100 text-red-700"
            icon={<ShoppingCart size={20} />}
          />
          <MetricCard
            title="This Month Sales"
            value={currency(summary?.thisMonthSales?.totalSales)}
            sub={`${summary?.thisMonthSales?.billCount || 0} bills`}
            change={pctChange(salesNow, salesPrev)}
            iconBg="bg-green-100 text-green-700"
            icon={<TrendingUp size={20} />}
          />
          <MetricCard
            title="This Month Purchases"
            value={currency(summary?.thisMonthPurchases?.totalPurchases)}
            sub={`${summary?.thisMonthPurchases?.purchaseCount || 0} purchases`}
            change={pctChange(purchasesNow, purchasesPrev)}
            iconBg="bg-orange-100 text-orange-700"
            icon={<TrendingDown size={20} />}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ChartCard title="Monthly Sales" />
          <ChartCard title="Monthly Purchases" />
        </div>

        {/* Top lists */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-800">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                <Crown size={16} />
              </span>
              Top Customers
            </div>
            <ul className="space-y-2">
              {(topCustomers || []).map((c) => (
                <li key={c._id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{c.shopName}</div>
                    <div className="text-xs text-gray-500">{c.billCount} bills</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-800">{currency(c.totalSales)}</div>
                </li>
              ))}
              {(!topCustomers || topCustomers.length === 0) && (
                <li className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">No data</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-800">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-blue-700">
                <FileText size={16} />
              </span>
              Top Suppliers
            </div>
            <ul className="space-y-2">
              {(topSuppliers || []).map((s) => (
                <li key={s._id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{s.shopName}</div>
                    <div className="text-xs text-gray-500">{s.purchaseCount} purchases</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-800">{currency(s.totalPurchases)}</div>
                </li>
              ))}
              {(!topSuppliers || topSuppliers.length === 0) && (
                <li className="rounded-xl bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">No data</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
