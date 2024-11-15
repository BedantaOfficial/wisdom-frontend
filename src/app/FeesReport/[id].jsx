import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { printStyles as styles } from "../../helpers/styles";
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getAuthToken } from "../../helpers/token";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import { ArrowBack } from "@mui/icons-material";

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

const LongPrint = () => {
  const location = useLocation();
  const payment = location.state;
  console.log(payment);
  const componentRef = useRef();

  const handlePrint = () => {
    const content = componentRef.current;

    // Get dynamic width and height from the content's dimensions
    const contentWidth = 400;
    const contentHeight = content.clientHeight + 5;

    // Convert width and height from pixels to inches for jsPDF
    const pxToInch = 96; // Default 96 pixels per inch
    const pdfWidth = contentWidth / pxToInch;
    const pdfHeight = contentHeight / pxToInch;

    // Configure options for the PDF
    const options = {
      margin: 0,
      filename: "full_payment_receipt.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "in",
        format: [pdfWidth, pdfHeight],
        orientation: "portrait",
      },
    };

    // Generate PDF using html2pdf and open it in a new tab
    html2pdf()
      .set(options)
      .from(content)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const pdfUrl = pdf.output("bloburl");
        const printWindow = window.open(pdfUrl, "_blank");

        // After the PDF is loaded in the new window, trigger the print dialog
        printWindow.onload = () => {
          printWindow.print(); // Opens the print dialog
        };
      });
  };

  const params = useParams();
  const id = params.id;
  const token = getAuthToken();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!token) {
    window.location.href = import.meta.env.VITE_MAIN_URL;
  }

  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/payments/all?user_id=${id}`,
        {
          headers: {
            "X-Auth-Token": token,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        const today = new Date();
        const fetchedPayments = response.data?.payments;
        const filteredPayments = fetchedPayments.filter((payment) => {
          return new Date(payment.updated_at) <= today;
        });
        setPayments(fetchedPayments);
      }
    } catch (error) {
      console.log(error);
      alert("Error fetching payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPayments();
    }
  }, [id]);

  if (!payment || !id)
    return (
      <h1
        style={{
          textAlign: "center",
          paddingTop: "20px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        404 not found
      </h1>
    );

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div style={styles.body}>
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
        <div ref={componentRef} style={styles.container}>
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
                backgroundColor: "#dddddd",
                borderBottom: "1px solid #ddd",
                padding: "5px 5px",
                fontWeight: "bold",
              }}
            >
              <div>Due Date</div>
              <div>Payment Date</div>
              <div>Amount</div>
            </div>
            {payments.map((p) => (
              <div
                style={{
                  ...styles.detailsContent,
                  borderBottom: "1px solid #ddd",
                  padding: "5px 5px",
                }}
              >
                <span>{formatDate(p.due_date)}</span>
                <span>
                  {p.updated_at ? formatDate(p.updated_at) : "----------"}
                </span>
                <span
                  style={{
                    minWidth: "100px",
                    textAlign: "right",
                  }}
                >
                  {p.amount} {p.status}
                </span>
              </div>
            ))}
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
                {payments
                  ?.reduce(
                    (acc, p) => acc + parseFloat(p.amount),
                    parseFloat(payment.admission_fees)
                  )
                  .toFixed(2)}
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
    </div>
  );
};

export default LongPrint;
