import React, { useState } from "react";
import "./index.css";
import { Menu, MenuItem } from "@mui/material";

const FeesReport = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
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
            <MenuItem className="dropdown-item" onClick={handleClose}>
              Today
            </MenuItem>
            <MenuItem className="dropdown-item" onClick={handleClose}>
              Date to Date
            </MenuItem>
          </Menu>
        </div>
      </div>
      {/* Date Range Selection */}
      <div className="row  mb-3">
        <div className="col">
          <input type="date" className="form-control" id="startDate" />
        </div>
        <div className="col">
          <input type="date" className="form-control" id="endDate" />
        </div>
        <div className="col">
          <button className="btn btn-primary" onclick="filterByDateRange()">
            Apply
          </button>
        </div>
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control search-bar"
          placeholder="Search here"
          aria-label="Search"
        />
      </div>
      <div className="student-list">
        {/* Example student item, repeat for more */}
        <div className="student-item" data-date="2024-05-04">
          <div className="student-icon">
            <i className="bi bi-person-fill" />
          </div>
          <div className="student-name">
            <div>
              <strong>Student 1</strong>
            </div>
            <div>May 4th, 2024</div>
          </div>
          <div className="action-icons">
            <i className="bi bi-eye" />
            <i className="bi bi-file-earmark-text" />
            <i className="bi bi-receipt" />
          </div>
        </div>
        {/* More student items with different data-date values */}
      </div>
    </div>
  );
};

export default FeesReport;
