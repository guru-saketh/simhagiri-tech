import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerBalances from "./components/CustomerBalances";
import CustomerTransactions from "./pages/CustomerTransactions"; // ⬅️ Create this page
import Header from "./components/Header";
import SupplierBalances from "./components/SupplierBalances";
import SupplierTransactions from "./pages/SupplierTransactions";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/customers" element={<CustomerBalances />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/customer/:id" element={<CustomerTransactions />} />
        <Route path="/suppliers" element={<SupplierBalances />} />
        <Route path="/supplier/:id" element={<SupplierTransactions />} />
      </Routes>
    </Router>
  );
}

export default App;
