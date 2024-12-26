import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import { getAuthToken } from "../../helpers/token";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import MUI ArrowBack icon

const ViewAnswer = () => {
  const token = getAuthToken();
  const navigate = useNavigate(); // Initialize navigate hook
  const location = useLocation();

  const params = new URLSearchParams(location?.search);
  const examId = params.get("examId");
  const studentId = params.get("studentId");

  const [answerFileUrl, setAnswerFileUrl] = useState(null);
  const [marks, setMarks] = useState({});
  const [papers, setPapers] = useState({});

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `${window.env.VITE_BASE_URL}/api/exam-students`,
        {
          params: { studentId, examId },
        }
      );
      console.log(response);
      if (response?.status === 200 && response?.data?.examDetails) {
        const examination = response?.data?.examDetails?.examination;

        const fetchedPapers = examination?.papers;
        const papers = {};
        fetchedPapers.forEach((paper) => {
          papers[paper.paper_code] = paper.name;
        });

        const fetchedMarks = response?.data?.examDetails?.marks
          ? JSON.parse(response?.data?.examDetails?.marks)
          : {};
        const marks = {};
        fetchedPapers.forEach((paper) => {
          marks[paper.paper_code] = fetchedMarks[paper?.paper_code] || "";
        });
        console.log(marks);

        setAnswerFileUrl(response?.data?.examDetails?.answer_file_url);
        setPapers(papers);
        setMarks(marks);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${window.env.VITE_BASE_URL}/api/v1/exams/giveMarks`,
        {
          studentId,
          examId,
          marks: JSON.stringify(marks),
        },
        {
          headers: {
            "X-Auth-Token": `${token}`,
          },
        }
      );

      if (response?.status === 200) {
        alert("Marks updated successfully!");
      }
    } catch (error) {
      console.error("Error updating marks:", error);
      alert("Failed to update marks. Please try again.");
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  useEffect(() => {
    if (examId && studentId) {
      fetchDetails();
    }
  }, [examId, studentId]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        {/* Go Back Button with MUI icon */}
        <button
          onClick={handleGoBack}
          className="flex items-center text-blue-600 mb-4 hover:underline"
        >
          <ArrowBackIcon className="mr-2" />
          Go Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">Answer File</h1>
        {answerFileUrl ? (
          <a
            href={window.env.VITE_PUBLIC_URL + answerFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View Answer File
          </a>
        ) : (
          <p className="text-gray-500">Not submitted yet</p>
        )}

        {/* Update Marks Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Update Marks
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {Object.entries(marks)?.map(([paper_code, mark]) => (
              <div
                className="flex flex-col items-start justify-start"
                key={paper_code}
              >
                <label className=" text-gray-700 font-medium mb-1">
                  {`${papers[paper_code]} ( ${paper_code} )`}
                </label>
                <input
                  type="number"
                  name="theory"
                  value={mark}
                  onChange={(e) =>
                    setMarks({ ...marks, [paper_code]: e.target.value })
                  }
                  min="0"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200 focus:outline-none"
                />
              </div>
            ))}

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-200 focus:outline-none"
            >
              Submit Marks
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewAnswer;
