import React, { useState, useEffect } from "react";
import "./index.css";
import { CircularProgress, IconButton, Menu, MenuItem } from "@mui/material";
import axios from "axios";
import { getAuthToken } from "../../helpers/token";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  ArrowBack,
  Article,
  FileCopy,
  Print,
  TextSnippet,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const FeesReport = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [paymentsData, setPaymentsData] = useState([]);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentState, setCurrentState] = useState("loading");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const token = getAuthToken(); // Get the token
  if (!token) {
    window.location.href = import.meta.env.VITE_MAIN_URL;
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchPayments = async () => {
    setPaymentsData([]);
    setCurrentState("loading");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/payments`,
        {
          headers: {
            "X-Auth-Token": token,
          },
        }
      );
      console.log("API Data:", response.data);
      if (response.status === 200) {
        setPaymentsData(response?.data);
        setCurrentState(response?.data?.length);
      } else {
        setPaymentsData([]);
        setCurrentState(0);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Failed to load payment data");
      setCurrentState(0);
    }
  };

  useEffect(() => {
    const s = location.state?.s;
    const e = location.state?.e;

    if (s || e) {
      setShowDatePicker(true);
      setStartDate(s);
      setEndDate(e);
      fetchPaymentsByDateRange();
    } else {
      fetchPayments();
    }
  }, [location.state]);

  // Function to fetch payments by date range
  const fetchPaymentsByDateRange = async () => {
    setPaymentsData([]);
    setCurrentState("loading");

    if (!token) {
      alert("No authentication token found.");
      setCurrentState(0);
      return;
    }

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/payments?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            "X-Auth-Token": token,
          },
        }
      );
      console.log("Filtered API Data:", response);
      if (response.status === 200) {
        setPaymentsData(response.data);
        setCurrentState(response?.data?.length || 0);

        setError(null); // Clear any previous errors
      } else {
        setPaymentsData([]);
        setCurrentState(0);
      }
    } catch (err) {
      console.error("Error fetching data by date range:", err);
      alert("Failed to load payment data for the selected date range");
      setCurrentState(0);
    }
  };

  const filteredPayments = () =>
    paymentsData.filter((payment) =>
      payment.name.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <div className="container">
      <IconButton
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          backgroundColor: "#1976d2",
          color: "#ffffff",
        }}
      >
        <ArrowBack />
      </IconButton>
      <div
        className="d-flex justify-content-between align-items-center mb-4"
        style={{
          marginTop: 60,
        }}
      >
        <div className="header-title">Fee’s Collection Report</div>
        {/* Sorting Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="sortDropdown"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            Sort
          </button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "sortDropdown",
            }}
          >
            <MenuItem
              className="dropdown-item"
              onClick={() => {
                setShowDatePicker(false);
                setStartDate("");
                setEndDate("");
                fetchPayments();
                handleClose();
              }}
            >
              Today
            </MenuItem>
            <MenuItem
              className="dropdown-item"
              onClick={() => {
                setShowDatePicker(true);
                handleClose();
              }}
            >
              Date to Date
            </MenuItem>
          </Menu>
        </div>
      </div>

      {/* Date Range Selection */}
      {showDatePicker && (
        <div className="row mb-3">
          <div className="col-6">
            <input
              type="date"
              className="form-control"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="col-6">
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col mt-2">
            <button
              className="btn btn-primary"
              onClick={fetchPaymentsByDateRange}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="input-group mb-3">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="form-control search-bar"
          placeholder="Search here"
          aria-label="Search"
        />
      </div>

      {/* Display Payments Data */}
      <div className="student-list">
        {currentState == 0 && (
          <div className="error-message">No Records Found</div>
        )}
        {currentState == "loading" && <CircularProgress />}
        {filteredPayments()?.length > 0 &&
          filteredPayments().map((payment, index) => (
            <div className="student-item" key={index} data-date={payment.date}>
              <div>
                <img
                  src={`${import.meta.env.VITE_FILE_URL}/${payment.filename}`}
                  alt={payment.name}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                />
              </div>
              <div className="student-name">
                <div>
                  <strong>{payment.name}</strong>
                </div>
                <div>{new Date(payment.updated_at).toLocaleDateString()}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 5,
                }}
              >
                <VisibilityIcon
                  fontSize="4"
                  onClick={() =>
                    (window.location.href = `${
                      import.meta.env.VITE_MAIN_URL
                    }/index.php/feeinfo/${payment.user_id}`)
                  }
                />
                <FileCopy
                  fontSize="4"
                  onClick={() =>
                    navigate(`/feesReport/print`, {
                      state: {
                        ...payment,
                        s: startDate,
                        e: endDate,
                      },
                    })
                  }
                />
                <Print
                  fontSize="4"
                  onClick={() =>
                    navigate(`/feesReport/${payment.user_id}`, {
                      state: {
                        ...payment,
                        s: startDate,
                        e: endDate,
                      },
                    })
                  }
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FeesReport;
