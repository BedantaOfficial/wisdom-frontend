import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";

const MyCertificate = () => {
  const [certificate, setCertificate] = useState(null);
  const [marksheet, setMarksheet] = useState(null);

  // Get the `id` parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  if (!id) {
    window.history.back();
  }

  useEffect(() => {
    fetchCertificates();
  }, []);

  // Function to fetch certificate and marksheet data
  const fetchCertificates = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/certificates?student_id=${id}`
      );
      console.log(response);
      if (response.status === 200) {
        setCertificate(response.data?.certificates);
        setMarksheet(response.data?.marksheet);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  // Function to handle downloading the file
  const handleDownload = (fileUrl, fileName) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  return (
    <div style={styles.container}>
      <IconButton
        onClick={() => window.history.back()}
        color="primary" // You can change the color to "secondary", "default", or any theme color
        aria-label="go back"
        sx={{
          float: "left",
          color: "#1976d2", // Customize color if needed
          "&:hover": { color: "#125ca8" },
        }}
      >
        <ArrowBack />
      </IconButton>
      <h2 style={styles.heading}>My Certificate and Marksheet</h2>

      {/* Certificate Section */}
      <div style={styles.card}>
        <h3>Certificate</h3>
        {certificate ? (
          <div style={styles.imageContainer}>
            <img src={certificate} alt="Certificate" style={styles.image} />
            <button
              style={styles.button}
              onClick={() => handleDownload(certificate, "certificate.jpg")}
            >
              Download Certificate
            </button>
          </div>
        ) : (
          <p>No certificate available</p>
        )}
      </div>

      {/* Marksheet Section */}
      <div style={styles.card}>
        <h3>Marksheet</h3>
        {marksheet ? (
          <div style={styles.imageContainer}>
            <img src={marksheet} alt="Marksheet" style={styles.image} />
            <button
              style={styles.button}
              onClick={() => handleDownload(marksheet, "marksheet.jpg")}
            >
              Download Marksheet
            </button>
          </div>
        ) : (
          <p>No marksheet available</p>
        )}
      </div>
    </div>
  );
};

// Basic styling
const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  card: {
    margin: "20px 0",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    color: "black",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    borderRadius: "5px",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default MyCertificate;
