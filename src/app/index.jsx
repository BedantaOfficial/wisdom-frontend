import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div id="root-body">
      <div className="header-title">Wisdom Computer Centre</div>
      <div className="header-subtitle">Smart Class</div>
      <div className="icon-grid">
        {/* Link for Attendance Report */}
        <Link
          to="/attendanceReport"
          className="icon-card"
          aria-label="Attendance Report Link"
        >
          <img src="images/attendance_icon.png" alt />
          <div className="icon-text">Attendance Report</div>
        </Link>
        {/* Link for Fee's Report */}
        <Link
          to="feesReport"
          className="icon-card"
          aria-label="Fee's Report Link"
        >
          <img src="images/fees_icon.png" alt />
          <div className="icon-text">Fee's Report</div>
        </Link>
        {/* Link for Expense Report */}
        <Link
          to="expenseReport"
          className="icon-card"
          aria-label="Expense Report Link"
        >
          <img src="images/expense_icon.png" alt />
          <div className="icon-text">Expense Report</div>
        </Link>
        {/* Link for Add Certificate */}
        <Link
          to="addCertificate"
          className="icon-card"
          aria-label="Add Certificate Link"
        >
          <img src="images/certificate_icon.png" alt />
          <div className="icon-text">Add Certificate</div>
        </Link>
      </div>
      <div className="footer-text">Wisdom Computer Centre smart class</div>
    </div>
  );
};

export default Home;
