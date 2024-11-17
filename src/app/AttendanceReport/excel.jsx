import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { utils, write, writeFile } from "xlsx";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { Menu, MenuItem } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ArrowBack } from "@mui/icons-material";
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ExcelReport = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  // Open menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleClose = () => {
    setAnchorEl(null);
  };
  const location = useLocation();
  console.log(location);

  const { courseRange, attendanceReport } = location.state || {};
  let currentMonth = new Date(courseRange.start).getMonth();

  if (!courseRange || !attendanceReport) {
    return <div>No data available.</div>;
  }

  const { start, end } = courseRange;
  const dateRange = [];
  let currentDate = new Date(start);

  // Generate all dates from start to end
  while (currentDate <= end) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    dateRange.push({
      Date: formattedDate,
      Status: attendanceReport[formattedDate] ? "Present" : "Absent",
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const exportTableToExcel = () => {
    const table = document.getElementById("report-table");

    const workbook = utils.table_to_book(table, {
      sheet: "Attendance Report",
    });
    if (window.ReactNativeWebView) {
      const base64 = write(workbook, { type: "base64" });

      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "TABLE_EXCEL", content: base64 })
      );
      return;
    }
    writeFile(workbook, "Student_Attendance_Report.xlsx");
  };

  // Function to export table to PDF
  function exportTableToPDF() {
    const doc = new jsPDF();
    const table = document.getElementById("report-table");
    doc.autoTable({ html: table });
    // Send the base64 PDF to React Native
    if (window.ReactNativeWebView) {
      const pdfBase64 = doc.output("datauristring");

      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "TABLE_PDF", content: pdfBase64 })
      );
    }
    doc.save("Student_Attendance_Report.pdf");
  }

  return (
    <div
      style={{
        width: "min(100%, 500px)",
        display: "flex",
        justifyContent: "center",
      }}
      id="attendance-report"
    >
      <IconButton
        onClick={() => navigate(-1)}
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
      <table id="report-table">
        <thead style={{ border: "1px solid white" }}>
          <tr>
            <th
              colSpan={3}
              style={{
                textAlign: "center",
                fontSize: "24px",
                backgroundColor: "blue",
              }}
            >
              Student Attendance Report
            </th>
          </tr>
          <tr>
            <th
              colSpan={3}
              style={{
                textAlign: "center",
              }}
            >
              Course Name: {courseRange.student.course}
              <br />
              Student Name: {courseRange.student.name}
              <br />
              Enrollment Number: {courseRange.student.enrollment_no}
              <br />
              Total Attendance: {Object.keys(attendanceReport).length}
            </th>
          </tr>
          <tr>
            <th
              colSpan={3}
              style={{ textAlign: "center", fontSize: "24px" }}
            ></th>
          </tr>
        </thead>
        <tbody>
          {dateRange.map((row, rowIndex) => {
            const date = new Date(row.Date);
            if (currentMonth !== date.getMonth() || rowIndex === 0) {
              currentMonth = date.getMonth();
              const options = { month: "long", year: "numeric" };
              return (
                <>
                  <tr key={row.Date + "name"}>
                    <td
                      colSpan={3}
                      style={{
                        textAlign: "center",
                        fontSize: "24px",
                        backgroundColor: "#e36630",
                      }}
                    >
                      {`${monthNames[date.getMonth()]} [${date.getFullYear()}]`}
                    </td>
                  </tr>
                  <tr key={row.Date + "heading"}>
                    <th
                      style={{
                        backgroundColor: "#00fdec",
                        color: "black",
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        backgroundColor: "#00fdec",
                        color: "black",
                      }}
                    >
                      Day
                    </th>
                    <th
                      style={{
                        backgroundColor: "#00fdec",
                        color: "black",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                  <tr key={row.Date + "data"}>
                    <td>{row.Date}</td>
                    <td>{dayNames[date.getDay()]}</td>
                    <td
                      style={{
                        backgroundColor:
                          row.Status === "Present" ? "green" : "red",
                      }}
                    >
                      {row.Status}
                    </td>
                  </tr>
                </>
              );
            }
            return (
              <tr key={row.Date + "data"}>
                <td>{row.Date}</td>
                <td>{dayNames[date.getDay()]}</td>
                <td
                  style={{
                    backgroundColor: row.Status === "Present" ? "green" : "red",
                  }}
                >
                  {row.Status}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Tooltip title="Export">
        <IconButton
          onClick={handleClick}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "white",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <FileDownloadIcon color="primary" />
        </IconButton>
      </Tooltip>

      {/* Menu for Export Options */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{
          style: {
            width: "200px",
            position: "absolute",
            top: "50px", // Adjust to fit your design
            right: "20px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {/* Export to Excel Option */}
        <MenuItem
          onClick={() => {
            exportTableToExcel();
            handleClose();
          }}
        >
          <DescriptionIcon style={{ marginRight: "8px" }} />
          Export to Excel
        </MenuItem>

        {/* Export to PDF Option */}
        <MenuItem
          onClick={() => {
            exportTableToPDF();
            handleClose();
          }}
        >
          <PictureAsPdfIcon style={{ marginRight: "8px" }} />
          Export to PDF
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ExcelReport;
