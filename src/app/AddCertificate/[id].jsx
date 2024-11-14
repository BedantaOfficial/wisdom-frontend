import React, { useState } from "react";
import "./index.css";
import { getAuthToken } from "../../helpers/token";
import { useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const AddCertificate = () => {
  const token = getAuthToken();
  if (!token) {
    window.location.href = import.meta.env.VITE_MAIN_URL;
  }

  const params = useParams();
  const id = params.id;
  const [certificate, setCertificate] = useState(null);
  const [marksheet, setMarksheet] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState("");
  const [marksheetPreview, setMarksheetPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event, setFile, setPreview) => {
    const file = event.target.files[0];
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    setLoading(true);
    try {
      const URL = `${
        import.meta.env.VITE_BASE_URL
      }/api/v1/certificates?student_id=${id}`;
      const formData = new FormData();
      formData.append("certificate", certificate);
      formData.append("marksheet", marksheet);

      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "X-Auth-Token": token,
        },
        body: formData,
      });
      console.log(response);

      if (response.status === 200) {
        alert("Certificate uploaded successfully");
      } else {
        alert("Failed to upload certificate");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Add Certificate</h2>

      {/* Select Certificate Button */}
      <button
        className="btn btn-custom"
        onClick={() => document.getElementById("certificateInput").click()}
      >
        Select Certificate
      </button>
      <input
        type="file"
        id="certificateInput"
        accept="image/*,application/pdf"
        style={{ display: "none" }}
        onChange={(e) =>
          handleFileChange(e, setCertificate, setCertificatePreview)
        }
      />

      {/* Certificate Preview */}
      <div className="preview-container">
        <span>Certificate Preview:</span>
        {certificatePreview ? (
          <img
            className="preview-img"
            src={certificatePreview}
            alt="Certificate Preview"
          />
        ) : (
          <span>No file chosen</span>
        )}
      </div>

      {/* Select Marksheet Button */}
      <button
        className="btn btn-custom"
        onClick={() => document.getElementById("marksheetInput").click()}
      >
        Select Marksheet
      </button>
      <input
        type="file"
        id="marksheetInput"
        accept="image/*,application/pdf"
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e, setMarksheet, setMarksheetPreview)}
      />

      {/* Marksheet Preview */}
      <div className="preview-container">
        <span>Marksheet Preview:</span>
        {marksheetPreview ? (
          <img
            className="preview-img"
            src={marksheetPreview}
            alt="Marksheet Preview"
          />
        ) : (
          <span>No file chosen</span>
        )}
      </div>

      {/* Submit Button */}
      {loading ? (
        <CircularProgress />
      ) : (
        <button className="btn btn-submit" onClick={handleUpload}>
          SUBMIT
        </button>
      )}
    </div>
  );
};

export default AddCertificate;
