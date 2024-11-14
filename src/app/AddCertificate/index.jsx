import React from "react";
import "./index.css";
const AddCertificate = () => {
  return (
    <div className="container">
      <h2>Add Certificate</h2>
      {/* Select Certificate Button */}
      <button
        className="btn btn-custom"
        onclick="selectFile('certificateInput')"
      >
        Select Certificate
      </button>
      <input
        type="file"
        id="certificateInput"
        accept="image/*,application/pdf"
        style={{ display: "none" }}
        onchange="previewFile('certificateInput', 'certificatePreview', 'certificatePdfIcon')"
      />
      {/* Certificate Preview */}
      <div className="preview-container">
        <span>Certificate Preview:</span>
        <img
          id="certificatePreview"
          className="preview-img"
          src
          alt="No file chosen"
        />
        <img
          id="certificatePdfIcon"
          className="pdf-icon"
          src="https://img.icons8.com/ios-filled/100/ffffff/pdf.png"
          alt="PDF File"
        />
      </div>
      {/* Select Marksheet Button */}
      <button className="btn btn-custom" onclick="selectFile('marksheetInput')">
        Select Marksheet
      </button>
      <input
        type="file"
        id="marksheetInput"
        accept="image/*,application/pdf"
        style={{ display: "none" }}
        onchange="previewFile('marksheetInput', 'marksheetPreview', 'marksheetPdfIcon')"
      />
      {/* Marksheet Preview */}
      <div className="preview-container">
        <span>Marksheet Preview:</span>
        <img
          id="marksheetPreview"
          className="preview-img"
          src
          alt="No file chosen"
        />
        <img
          id="marksheetPdfIcon"
          className="pdf-icon"
          src="https://img.icons8.com/ios-filled/100/ffffff/pdf.png"
          alt="PDF File"
        />
      </div>
      {/* Submit Button */}
      <button className="btn btn-submit" onclick="submitForm()">
        SUBMIT
      </button>
    </div>
  );
};

export default AddCertificate;
