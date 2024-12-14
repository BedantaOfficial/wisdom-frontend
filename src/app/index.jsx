import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import { getAuthToken } from "../helpers/token";
import { IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import feeImg from "../assets/images/fee.jpg";
import certificateImg from "../assets/images/certificate.jpg";
import expenseImg from "../assets/images/expense.jpg";
import attendanceImg from "../assets/images/attendance.jpg";
const Home = () => {
  const token = getAuthToken();
  if (!token) {
    window.location.href = import.meta.env.VITE_MAIN_URL;
  }
  return (
    <div id="root-body">
      <IconButton
        onClick={() =>
          (window.location.href = `${
            import.meta.env.VITE_MAIN_URL
          }/index.php/dashboard`)
        }
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
      <div className="header-title">Wisdom Computer Centre</div>
      <div className="header-subtitle">Smart Class</div>
      <div className="icon-grid">
        {/* Link for Attendance Report */}
        <Link
          to="/attendanceReport"
          className="icon-card"
          aria-label="Attendance Report Link"
        >
          <img src={attendanceImg} alt />
          <div className="icon-text">Attendance Report</div>
        </Link>
        {/* Link for Fee's Report */}
        <Link
          to="feesReport"
          className="icon-card"
          aria-label="Fee's Report Link"
        >
          <img src={feeImg} alt />
          <div className="icon-text">Fee's Report</div>
        </Link>
        {/* Link for Expense Report */}
        <Link
          to="manageExam"
          className="icon-card"
          aria-label="Expense Report Link"
        >
          <img src={expenseImg} alt />
          <div className="icon-text">Exam Report</div>
        </Link>
        {/* Link for Add Certificate */}
        <Link
          to="addCertificate"
          className="icon-card"
          aria-label="Add Certificate Link"
        >
          <img src={certificateImg} alt />
          <div className="icon-text">Add Certificate</div>
        </Link>
      </div>
      <div className="footer-text">Wisdom Computer Centre smart class</div>
    </div>
  );
};

export default Home;
