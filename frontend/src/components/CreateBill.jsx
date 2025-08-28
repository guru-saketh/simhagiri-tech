import React, { useEffect, useState } from "react";
import axios from "axios";
import { ReceiptText } from "lucide-react";
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

const CreateBill = ({
  triggerLabel = "+ Create Bill",
  dialogTitle = "Create Bill",
  saveLabel = "Save Bill",
}) => {
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
        const res = await axios.get("http://localhost:5001/api/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Error fetching customers", err);
      }
    }
    fetchCustomers();

    // Listen for customer updates to refresh options without reload
    const handler = () => fetchCustomers();
    window.addEventListener("customers:updated", handler);
    return () => window.removeEventListener("customers:updated", handler);
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
      await axios.post("http://localhost:5001/api/bills", {
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
      // Notify other views (balances, transactions) to refresh
      window.dispatchEvent(new CustomEvent("bills:updated"));
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
      <Button
        variant="contained"
        startIcon={<ReceiptText size={16} />}
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
              {/* ✅ Autocomplete with full width */}
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
                    fullWidth
                  />
                )}
              />

              {/* ✅ DatePicker with full width */}
              <DatePicker
                label="Bill Date"
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

              {/* ✅ TextFields already full width */}
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

export default CreateBill;
