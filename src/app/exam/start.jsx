import { CircularProgress, Button, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Start = () => {
  const examId = localStorage.getItem("examId");
  const studentId = localStorage.getItem("studentId");
  const [examDetails, setExamDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false); // To handle the loading state for starting exam
  const navigate = useNavigate();

  const fetchExamStudentDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/exam-students`,
        {
          params: { studentId, examId },
        }
      );
      const details = response?.data?.examDetails;
      setExamDetails(details);

      if (!details) {
        navigate("/exam");
      }

      if (details?.started_at) {
        navigate("/exam/action"); // Redirect if the exam has already started
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamStudentDetails();
  }, [studentId, examId]);

  if (loading) return <CircularProgress />;

  const totalTime = examDetails?.examination?.time_in_seconds;
  const { mcq, theory, practical } = examDetails?.examination || {};
  const sectionsCount = [mcq, theory, practical].filter(Boolean).length;

  const sectionNames = [
    mcq ? "MCQ" : null,
    theory ? "Theory" : null,
    practical ? "Practical" : null,
  ].filter(Boolean);

  // Convert total time from seconds to hours and minutes
  const hours = Math.floor(totalTime / 3600);
  const minutes = Math.floor((totalTime % 3600) / 60);

  const handleStartExam = async () => {
    setStarting(true);
    try {
      // Call the API to start the exam
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/exam-students/startexam`,
        { examId, studentId }
      );
      if (response.status === 200) {
        navigate("/exam/action");
      } else {
        console.log("Failed to start exam");
      }
    } catch (error) {
      console.error("Error starting exam:", error);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto my-5">
      <Typography
        variant="h4"
        className="text-3xl font-semibold text-gray-800 mb-6 text-center"
      >
        Exam Details
      </Typography>

      <div className="mb-6">
        <Typography variant="h6" className="text-xl font-medium text-gray-700">
          Total Time:{" "}
          <span className="font-bold">{`${hours} hours ${minutes} minutes`}</span>
        </Typography>
      </div>

      <div className="mb-6">
        <Typography variant="h6" className="text-xl font-medium text-gray-700">
          Number of Sections: <span className="font-bold">{sectionsCount}</span>
        </Typography>
        <div className="mt-4 space-y-2">
          {sectionNames.map((section, index) => (
            <Typography key={index} className="text-lg text-gray-600">
              - {section}
            </Typography>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        {sectionsCount > 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleStartExam}
            disabled={starting} // Disable the button while starting the exam
            className="py-3 px-8 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-300"
          >
            {starting ? "Starting..." : "Start Exam"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Start;
