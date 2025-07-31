import React, { useEffect, useState } from "react";
import axios from "axios";
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

const CreateBill = () => {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customer: null,
    amountPurchased: "",
    amountGiven: "",
    date: new Date(), // default to today
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const balance =
    form.amountGiven && form.amountPurchased
      ? Number(form.amountPurchased) - Number(form.amountGiven)
      : "";

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await axios.get("http://localhost:5000/api/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Error fetching customers", err);
      }
    }
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCustomerSelect = (e, value) => {
    setForm({ ...form, customer: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customer?._id) {
      alert("Please select a customer");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/bills", {
        customer: form.customer._id,
        amountPurchased: Number(form.amountPurchased),
        amountGiven: Number(form.amountGiven),
        balance,
        date: form.date,
      });

      setSnackbar({
        open: true,
        message: "Bill created successfully",
        severity: "success",
      });
      setOpen(false);
      setForm({
        customer: null,
        amountPurchased: "",
        amountGiven: "",
        date: new Date(),
      });
    } catch (err) {
      console.error("Error creating bill:", err);
      setSnackbar({
        open: true,
        message: "Failed to create bill",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        + Create Bill
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create Bill</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Autocomplete
                options={customers}
                getOptionLabel={(option) => option.shopName || ""}
                value={form.customer}
                onChange={handleCustomerSelect}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Customer"
                    required
                    margin="normal"
                  />
                )}
              />

              <DatePicker
                label="Bill Date"
                value={form.date}
                onChange={(newDate) => setForm({ ...form, date: newDate })}
                format="dd-MM-yyyy" // ✅ show date in dd-MM-yyyy format
                views={["year", "month", "day"]} // ✅ shows year first, then month, then day
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />

              <TextField
                label="Amount Purchased"
                name="amountPurchased"
                type="number"
                fullWidth
                required
                value={form.amountPurchased}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                label="Amount Given"
                name="amountGiven"
                type="number"
                fullWidth
                value={form.amountGiven}
                onChange={handleChange}
                margin="normal"
              />
              {form.amountGiven && form.amountPurchased && (
                <TextField
                  label="Balance"
                  value={balance}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  margin="normal"
                />
              )}
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Save Bill
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

export default CreateBill;
