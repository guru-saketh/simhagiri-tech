import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  List,
  ListItemButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";

const CustomerBalances = () => {
  const [balances, setBalances] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBalances() {
      try {
        const res = await axios.get("http://localhost:5000/api/bills/balances");
        setBalances(res.data);
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    }

    fetchBalances();
  }, []);

  const formatRupee = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

  const filteredBalances =
    selectedLetter === "All"
      ? balances
      : balances.filter((c) =>
          c.shopName?.toUpperCase().startsWith(selectedLetter)
        );

  return (
    <Box display="flex" p={2} gap={2}>
      {/* Sidebar A–Z */}
      <Paper elevation={2} sx={{ width: 80, height: "fit-content" }}>
        <List dense>
          <ListItemButton
            selected={selectedLetter === "All"}
            onClick={() => setSelectedLetter("All")}
          >
            <Typography variant="body2" fontWeight="bold">
              All
            </Typography>
          </ListItemButton>
          <Divider />
          {alphabet.map((letter) => (
            <ListItemButton
              key={letter}
              selected={selectedLetter === letter}
              onClick={() => setSelectedLetter(letter)}
            >
              <Typography variant="body2">{letter}</Typography>
            </ListItemButton>
          ))}
        </List>
      </Paper>

      {/* Customer Balance Table */}
      <Box flex={1}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {selectedLetter === "All"
            ? "All Customers"
            : `Customers: ${selectedLetter}`}
        </Typography>

        {filteredBalances.length === 0 ? (
          <Typography color="text.secondary">
            No customers starting with '{selectedLetter}'
          </Typography>
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Shop Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Area</TableCell>
                  <TableCell>Total Purchased</TableCell>
                  <TableCell>Total Given</TableCell>
                  <TableCell>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBalances.map((c) => (
                  <TableRow
                    key={c._id}
                    hover
                    onClick={() => navigate(`/customer/${c._id}`)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{c.shopName}</TableCell>
                    <TableCell>{c.contactNumber}</TableCell>
                    <TableCell>{c.area}</TableCell>
                    <TableCell>{formatRupee(c.totalPurchased)}</TableCell>
                    <TableCell>{formatRupee(c.totalGiven)}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "red" }}>
                      {formatRupee(c.balance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default CustomerBalances;
