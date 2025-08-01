import React from "react";
import AddCustomer from "./AddCustomer";
import CreateBill from "./CreateBill";

const Header = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg">
      {/* Right side heading */}
      <h1 className="text-xl font-semibold text-gray-800">Welcome Back</h1>
      {/* Left side buttons */}
      <div className="flex gap-4">
        <AddCustomer />
        <CreateBill />
      </div>
    </div>
  );
};

export default Header;
