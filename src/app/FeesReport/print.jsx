import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { printStyles as styles } from "../../helpers/styles";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const ShortPrint = () => {
  const location = useLocation();
  const payment = location.state;
  const reportRef = useRef();

  if (!payment) return <h1>404 not found</h1>;

  const handlePrint = async () => {
    const reportElement = reportRef.current;

    const canvas = await html2canvas(reportElement, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 190; // PDF width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("payment_receipt.pdf");
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={styles.body}>
        <div ref={reportRef} style={styles.container}>
          <div style={styles.header}>
            <p style={styles.headerContent}>WISDOM COMPUTER</p>
            <p style={styles.headerContent}>SMART CLASS</p>
            <p style={styles.headerContent}>+917002331984</p>
            <p style={styles.headerContent}>Rajbanglow Road , Karimganj</p>
          </div>
          <div style={styles.feeTitle}>Fee Collection Receipt</div>
          <div style={styles.details}>
            <div style={{ ...styles.detailsContent, marginBottom: 5 }}>
              <strong>ISSUED TO:</strong>
              <span></span>
            </div>
            <div style={styles.detailsContent}>
              <span>Student Name</span>
              <span>{payment.name}</span>
            </div>
            <div style={styles.detailsContent}>
              <span>Enrollment no.</span>
              <span>{payment.enrollment_no}</span>
            </div>
            <div style={styles.detailsContent}>
              <span>Admission Date</span>
              <span>{formatDate(payment.date_of_admission)}</span>
            </div>
            <div style={styles.detailsContent}>
              <span>Admission Fees</span>
              <span>{payment.admission_fees} paid</span>
            </div>
          </div>
          <div style={styles.details}>
            <div
              style={{
                ...styles.detailsContent,
                borderBottom: "1px solid #ddd",
                padding: "5px 5px",
              }}
            >
              <span>{formatDate(payment.due_date)}</span>
              <span>{payment.amount}</span>
            </div>
            <div
              style={{
                ...styles.detailsContent,
                backgroundColor: "#dddddd",
                borderBottom: "1px solid #ddd",
                padding: "5px 5px",
                fontWeight: "bold",
              }}
            >
              <div>TOTAL</div>
              <div>
                {(
                  parseFloat(payment.amount) +
                  parseFloat(payment.admission_fees)
                ).toFixed(2)}
              </div>
            </div>
          </div>
          <div style={styles.thankyou}>
            THANK YOU
            <br />
            WISDOM SMART CLASS
          </div>
        </div>
      </div>
      <IconButton
        onClick={handlePrint}
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "#1976d2",
          color: "#ffffff",
        }}
      >
        <PrintIcon />
      </IconButton>
    </div>
  );
};

export default ShortPrint;
