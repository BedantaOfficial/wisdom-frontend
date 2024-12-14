import { ArrowBack } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const EnrolledStudents = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col justify-between items-center bg-gray-100">
      <div className="w-[95%] py-2">
        <IconButton
          onClick={() => navigate("/manageExam")}
          style={{
            backgroundColor: "#1976d2",
            color: "#ffffff",
          }}
        >
          <ArrowBack />
        </IconButton>
      </div>
    </div>
  );
};

export default EnrolledStudents;
