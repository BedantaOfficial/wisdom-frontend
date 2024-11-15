import { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { getAuthToken } from "../../helpers/token";
import axios from "axios";
import { CircularProgress, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
const AddCertificate = () => {
  const { id } = useParams();
  const certificateRef = useRef(null);
  const marksheetRef = useRef(null);
  // image preview
  const [certificateSrc, setCertificateSrc] = useState(null);
  const [marksheetSrc, setMarksheetSrc] = useState(null);
  // image file
  const [certificateFile, setCertificateFile] = useState(null);
  const [marksheetFile, setMarksheetFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = getAuthToken();
  if (!token) {
    window.location.href = import.meta.env.VITE_MAIN_URL;
  }

  const handleCertificateUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setCertificateFile(selectedFile);
      // Create an image preview
      const reader = new FileReader();
      reader.onload = (e) => setCertificateSrc(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleMarksheetUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setMarksheetFile(selectedFile);
      // Create an image preview
      const reader = new FileReader();
      reader.onload = (e) => setMarksheetSrc(e.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleClear = () => {
    setCertificateFile(null);
    setCertificateSrc(null);
    setMarksheetFile(null);
    setMarksheetSrc(null);
  };
  const handleSubmit = async () => {
    setLoading(true);
    if (!certificateFile) {
      alert("Please select a certificate");
      setLoading(false);
      return;
    }
    if (!marksheetFile) {
      alert("Please select a marksheet ");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("certificate", certificateFile);
    formData.append("marksheet", marksheetFile);

    const URL = `${
      import.meta.env.VITE_BASE_URL
    }/api/v1/certificates?student_id=${id}`;
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "X-Auth-Token": token,
      },
      body: formData,
    });
    if (response.status === 200) {
      const data = await response.json();
      console.log("data", data);
      handleClear();
      alert("Uploaded successfully");
    } else {
      alert("Failed to upload certificate");
    }
    setLoading(false);
  };

  // Function to fetch certificate and marksheet data
  const fetchCertificates = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/certificates?student_id=${id}`
      );
      console.log(response);
      if (response.status === 200) {
        setCertificateSrc(response.data?.certificates);
        setMarksheetSrc(response.data?.marksheet);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [id]);

  return (
    <div className={styles.certificate_body}>
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
      <div className={styles.main_container}>
        <div className={styles.container}>
          <h2>Add Certificate</h2>
          {/* Select Certificate Button */}
          <button
            className={`btn ${styles.btn_custom}`}
            onClick={() => certificateRef.current.click()}
          >
            Select Certificate
          </button>
          <input
            ref={certificateRef}
            onChange={handleCertificateUpload}
            type="file"
            id="certificateInput"
            accept="image/*"
            style={{ display: "none" }}
          />
          {/* Certificate Preview */}
          <div className={styles.preview_container}>
            <span>Certificate Preview:</span>
            {certificateSrc ? (
              <img
                id="certificatePreview"
                className={styles.preview_img}
                src={certificateSrc}
                alt="No file chosen"
              />
            ) : (
              <img
                id="certificatePdfIcon"
                className={styles.pdf_icon}
                src="https://img.icons8.com/ios-filled/100/ffffff/pdf.png"
                alt="PDF File"
              />
            )}
          </div>
          {/* Select Marksheet Button */}
          <button
            className={`btn ${styles.btn_custom}`}
            onClick={() => marksheetRef.current.click()}
          >
            Select Marksheet
          </button>
          <input
            type="file"
            ref={marksheetRef}
            onChange={handleMarksheetUpload}
            id="marksheetInput"
            accept="image/*"
            style={{ display: "none" }}
          />
          {/* Marksheet Preview */}
          <div className={styles.preview_container}>
            <span>Marksheet Preview:</span>
            {marksheetSrc ? (
              <img
                id="marksheetPreview"
                className={styles.preview_img}
                src={marksheetSrc}
                alt="No file chosen"
              />
            ) : (
              <img
                id="marksheetPdfIcon"
                className={styles.pdf_icon}
                src="https://img.icons8.com/ios-filled/100/ffffff/pdf.png"
                alt="PDF File"
              />
            )}
          </div>
          {/* Submit Button */}
          {loading ? (
            <CircularProgress />
          ) : (
            <button
              className={`btn ${styles.btn_submit}`}
              onClick={handleSubmit}
            >
              SUBMIT
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCertificate;
