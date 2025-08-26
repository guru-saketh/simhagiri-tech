import React, { useState } from "react";
import axios from "axios";
import { UserPlus } from "lucide-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const AddParty = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    role: "customer", // 'customer' | 'supplier'
    shopName: "",
    area: "",
    contactNumber: "",
    gst: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        shopName: form.shopName,
        area: form.area,
        contactNumber: form.contactNumber,
        gst: form.gst,
      };
      if (form.role === "customer") {
        await axios.post("http://localhost:5001/api/customers", payload);
        window.dispatchEvent(new CustomEvent("customers:updated"));
      } else {
        await axios.post("http://localhost:5001/api/suppliers", payload);
        window.dispatchEvent(new CustomEvent("suppliers:updated"));
      }
      setSnackbar({ open: true, message: `${form.role === "customer" ? "Customer" : "Supplier"} added successfully`, severity: "success" });
      setShowModal(false);
      setForm({ role: form.role, shopName: "", area: "", contactNumber: "", gst: "" });
    } catch (error) {
      console.error("Error adding party:", error);
      setSnackbar({ open: true, message: "Failed to add", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<UserPlus size={16} />}
        onClick={() => setShowModal(true)}
        sx={{
          borderRadius: "9999px",
          textTransform: "none",
          px: 2.5,
          py: 1,
          bgcolor: "white",
          borderColor: "#e5e7eb",
          ":hover": { bgcolor: "#f9fafb", borderColor: "#d1d5db" },
        }}
      >
        Add Party
      </Button>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Party</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                label="Role"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="supplier">Supplier</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="shopName"
              label="Name / Shop Name"
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

export default AddParty;
