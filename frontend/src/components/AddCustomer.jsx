import React from 'react'
import axios from 'axios'
import { useState } from 'react'

const AddCustomer = () => {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
      shopName: "",
      area: "",
      contactNumber: "",
      gst: "",
    });
    const handleChange =(e)=>{
        const {name,value} =e.target
        setForm({...form,[name]:value})
    }
    const handleSubmit =async(e)=>{
        e.preventDefault();
        try{
            await axios.post('http://localhost:5000/api/customers', form);
            alert('Customer added successfully');
            setShowModal(false);
            setForm({ shopName: '', area: '', contactNumber: '', gst: '' });
        }
        catch(error){
            console.error('Error adding customer:', error);
            alert('Failed to add customer. Please try again.');
    }
}
  return (
    <>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => setShowModal(true)}
      >
        + Add Customer
      </button>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Customer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="shopName"
                placeholder="Shop Name"
                value={form.shopName}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="area"
                placeholder="Area"
                value={form.area}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                value={form.contactNumber}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="gst"
                placeholder="GST Number (optional)"
                value={form.gst}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddCustomer