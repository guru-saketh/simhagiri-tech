import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBag } from "lucide-react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Receipt, Cancel, Save } from "@mui/icons-material";

const CreatePurchase = ({
  triggerLabel = "+ Record Purchase",
  dialogTitle = "Record Purchase",
  saveLabel = "Save Purchase",
}) => {
  const [open, setOpen] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    supplier: null,
    amountPurchased: "",
    amountPaid: "",
    date: new Date(),
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const balance = form.amountPurchased && form.amountPaid
    ? Number(form.amountPurchased) - Number(form.amountPaid)
    : "";

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const res = await axios.get("http://localhost:5001/api/suppliers");
        setSuppliers(res.data);
      } catch (err) {
        console.error("Error fetching suppliers", err);
      }
    }
    fetchSuppliers();

    // Refresh supplier options when suppliers are updated
    const handler = () => fetchSuppliers();
    window.addEventListener("suppliers:updated", handler);
    return () => window.removeEventListener("suppliers:updated", handler);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSupplierSelect = (e, value) => {
    setForm({ ...form, supplier: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplier?._id) {
      alert("Please select a supplier");
      return;
    }
    try {
      await axios.post("http://localhost:5001/api/purchases", {
        supplier: form.supplier._id,
        amountPurchased: Number(form.amountPurchased),
        amountPaid: Number(form.amountPaid),
        date: form.date,
      });
      setSnackbar({ open: true, message: "Purchase recorded successfully", severity: "success" });
      // Notify other views (supplier balances, transactions) to refresh
      window.dispatchEvent(new CustomEvent("purchases:updated"));
      setOpen(false);
      setForm({ supplier: null, amountPurchased: "", amountPaid: "", date: new Date() });
    } catch (err) {
      console.error("Error creating purchase:", err);
      setSnackbar({ open: true, message: "Failed to create purchase", severity: "error" });
    }
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<ShoppingBag size={16} />}
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: "9999px",
          textTransform: "none",
          px: 2.5,
          py: 1,
          boxShadow: "none",
          ":hover": { boxShadow: "none" },
        }}
      >
        {triggerLabel}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Autocomplete
                options={suppliers}
                getOptionLabel={(option) => option.shopName || ""}
                value={form.supplier}
                onChange={handleSupplierSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Supplier"
                    required
                    margin="normal"
                    fullWidth
                  />
                )}
              />

              <DatePicker
                label="Purchase Date"
                value={form.date}
                onChange={(newDate) => setForm({ ...form, date: newDate })}
                format="dd-MM-yyyy"
                views={["year", "month", "day"]}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "normal",
                  },
                }}
              />

              <TextField
                label="Amount Purchased"
                name="amountPurchased"
                type="number"
                fullWidth
                value={form.amountPurchased}
                onChange={handleChange}
                margin="normal"
              />

              <TextField
                label="Amount Paid"
                name="amountPaid"
                type="number"
                fullWidth
                value={form.amountPaid}
                onChange={handleChange}
                margin="normal"
              />

              {form.amountPurchased && form.amountPaid && (
                <TextField
                  label="Balance (You Owe)"
                  value={balance}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  margin="normal"
                />
              )}
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpen(false)}
              color="secondary"
              startIcon={<Cancel />}
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: "9999px",
                px: 2.5,
                py: 1,
                transition: "all 0.2s ease-in-out", // smooth animation
                ":hover": {
                  transform: "translateY(-3px)", // ✅ lifts up
                  boxShadow: "0 6px 12px rgba(0,0,0,0.15)", // ✅ soft shadow
                  backgroundColor: "rgba(220, 38, 38, 0.1)", // subtle red tint
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              sx={{
                textTransform: "none",
                borderRadius: "9999px",
                px: 2.5,
                py: 1,
                boxShadow: "none",
                transition: "all 0.2s ease-in-out",
                ":hover": {
                  transform: "translateY(-3px)", // ✅ lifts up
                  boxShadow: "0 6px 12px rgba(0,0,0,0.2)", // ✅ stronger shadow
                  backgroundColor: "primary.dark",
                },
              }}
            >
              {saveLabel}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreatePurchase;
