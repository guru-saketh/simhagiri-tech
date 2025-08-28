import React from "react";
import AddParty from "./AddParty";
import CreateBill from "./CreateBill";
import CreatePurchase from "./CreatePurchase";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isSuppliers =
    location.pathname.startsWith("/suppliers") ||
    location.pathname.startsWith("/supplier/");

  const navLink = (to, label) => {
    const active = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));
    const base = "px-3 py-1.5 rounded-full text-sm transition-colors";
    const activeCls = "bg-blue-100 text-blue-700";
    const idleCls = "text-blue-600 hover:bg-blue-50";
    return (
      <Link className={`${base} ${active ? activeCls : idleCls}`} to={to}>
        {label}
      </Link>
    );
  };
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
      {/* Right side heading */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Welcome Back</h1>
        <nav className="flex items-center gap-2">
          {navLink("/", "Dashboard")}
          {navLink("/customers", "Customers")}
          {navLink("/suppliers", "Suppliers")}
        </nav>
      </div>
      {/* Left side buttons */}
      <div className="flex gap-4">
        <AddParty />
        {isSuppliers ? (
          <CreatePurchase
            triggerLabel={"+ Purchase Bill"}
            dialogTitle={"Purchase Bill"}
            saveLabel={"Save Purchase Bill"}
          />
        ) : (
          <CreateBill
            triggerLabel={"+ Customer Bill"}
            dialogTitle={"Customer Bill"}
            saveLabel={"Save Customer Bill"}
          />
        )}
      </div>
    </div>
  );
};

export default Header;

