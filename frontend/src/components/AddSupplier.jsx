import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

const AddSupplier = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    shopName: "",
    area: "",
    contactNumber: "",
    gst: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/suppliers", form);
      setSnackbar({ open: true, message: "Supplier added successfully", severity: "success" });
      // Notify other components to refresh supplier lists
      window.dispatchEvent(new CustomEvent("suppliers:updated"));
      setShowModal(false);
      setForm({ shopName: "", area: "", contactNumber: "", gst: "" });
    } catch (error) {
      console.error("Error adding supplier:", error);
      setSnackbar({ open: true, message: "Failed to add supplier", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setShowModal(true)}>
        + Add Supplier
      </Button>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Supplier</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              name="shopName"
              label="Supplier/Shop Name"
              fullWidth
              required
              margin="normal"
              value={form.shopName}
              onChange={handleChange}
            />
            <TextField
              name="area"
              label="Area"
              fullWidth
              required
              margin="normal"
              value={form.area}
              onChange={handleChange}
            />
            <TextField
              name="contactNumber"
              label="Contact Number"
              fullWidth
              required
              margin="normal"
              value={form.contactNumber}
              onChange={handleChange}
            />
            <TextField
              name="gst"
              label="GST Number (optional)"
              fullWidth
              margin="normal"
              value={form.gst}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowModal(false)} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddSupplier;
