import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerBalances from "./components/CustomerBalances";
import CustomerTransactions from "./pages/CustomerTransactions"; // ⬅️ Create this page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerBalances />} />
        <Route path="/customer/:id" element={<CustomerTransactions />} />
      </Routes>
    </Router>
  );
}

export default App;
