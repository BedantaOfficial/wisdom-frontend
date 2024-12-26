import { ArrowBack, Print, Visibility } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuthToken } from "../../helpers/token";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EnrolledStudents = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getAuthToken();

  if (!token) {
    window.location.href = window.env.VITE_MAIN_URL;
  }

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [students, setStudents] = useState([]);
  const [examination, setExamination] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [updatingMarks, setUpdatingMarks] = useState(false);

  const [marks, setMarks] = useState({});
  const [papers, setPapers] = useState({});

  const fetchExams = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${window.env.VITE_BASE_URL}/api/v1/exams`,
        {
          headers: {
            "X-Auth-Token": `${token}`,
          },
        }
      );
      if (response.status === 200 && response.data?.examinations) {
        const fetchedExams = response.data?.examinations;
        setExams(fetchedExams || []);
        setSelectedExam(fetchedExams[0]);
        await fetchExamDetails(fetchedExams[0]?.exam_date);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExamDetails = async (examDate) => {
    setLoading("examDetails");
    try {
      const response = await axios.get(
        `${window.env.VITE_BASE_URL}/api/v1/exams/${examDate}`,
        {
          headers: {
            "X-Auth-Token": `${token}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200 && response.data?.examination) {
        const students = response.data?.examination?.students;
        const examination = response.data?.examination;

        const fetchedPapers = examination?.course?.papers;
        const papers = {};
        fetchedPapers.forEach((paper) => {
          papers[paper.paper_code] = paper.name;
        });

        const fetchedMarks = examination?.marks
          ? JSON.parse(examination?.marks)
          : {};
        const marks = {};
        fetchedPapers.forEach((paper) => {
          marks[paper.paper_code] = fetchedMarks[paper?.paper_code] || "";
        });
        console.log(marks);

        setPapers(papers);
        setMarks(marks);
        setExamination(examination);
        setStudents(students);
        setFilteredStudents(students);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = async (date) => {
    navigate(`/enrolledStudents?date=${moment(date).format("YYYY-MM-DD")}`);
    // const selectedExam = exams.find((exam) =>
    //   moment(exam.exam_date).isSame(date, "day")
    // );
    // if (selectedExam) {
    //   setSelectedExam(selectedExam);
    //   await fetchExamDetails(selectedExam?.exam_date);
    // }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = students.filter(
      (student) =>
        student.name?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query)
    );
    setFilteredStudents(filtered);
  };

  const handleUpdateMarks = async () => {
    setUpdatingMarks(true);
    try {
      // Logic to update marks (example API request)
      const response = await axios.post(
        `${window.env.VITE_BASE_URL}/api/v1/exams/updateMarks`,
        {
          examId: selectedExam.id,
          marks: JSON.stringify(marks),
        },
        {
          headers: {
            "X-Auth-Token": `${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Marks updated successfully!");
      }
    } catch (error) {
      console.error("Error updating marks:", error);
    } finally {
      setUpdatingMarks(false);
    }
  };

  const examDates = exams.map((exam) =>
    moment(exam.exam_date).format("YYYY-MM-DD")
  );

  const isExamDate = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    return examDates.includes(formattedDate);
  };

  useEffect(() => {
    if (!exams) return console.log("object");
    const search = location?.search;
    let date = null;
    if (search) {
      const searchParams = new URLSearchParams(search);
      date = searchParams.get("date");
    }
    if (date) {
      const selectedExam = exams.find((exam) =>
        moment(exam.exam_date).isSame(date, "day")
      );
      if (selectedExam) {
        setSelectedExam(selectedExam);
        fetchExamDetails(selectedExam?.exam_date);
      }
    }
  }, [exams, location, location.search]);

  useEffect(() => {
    fetchExams();
  }, []);

  const renderStudents = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStudents?.map((student) => (
        <div
          key={student.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <img
            src={`${window.env.VITE_FILE_URL}/${student.filename}`}
            alt={student.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="ml-4 flex-1 text-black max-w-[50%] overflow-hidden">
            <p className="text-lg font-semibold">{student.name}</p>
            <p className="text-gray-500 text-sm">{student.email}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                navigate(
                  `/enrolledStudents/viewAnswer?examId=${selectedExam.id}&studentId=${student.id}`
                )
              }
              className="text-blue-600 hover:text-blue-800 transition"
            >
              <Visibility />
            </button>
            {/* <button
              onClick={() => console.log("Print clicked for", student.name)}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              <Print />
            </button> */}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col items-center bg-gray-50 p-6 space-y-6">
      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => navigate("/manageExam")}
          className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          <ArrowBack />
          <span>Back</span>
        </button>
        <DatePicker
          className="text-center w-full py-2 px-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600"
          selected={selectedExam ? new Date(selectedExam.exam_date) : null}
          onChange={handleDateSelect}
          highlightDates={examDates.map((date) => new Date(date))}
          dayClassName={(date) => (isExamDate(date) ? "exam-day" : undefined)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select Exam Date"
        />
      </div>

      <div className="w-full mt-4">
        {loading === "examDetails" ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="py-2">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Total Marks
            </h2>
            <div className="space-y-4 mb-6">
              {Object.entries(marks)?.map(([paper_code, mark]) => (
                <div
                  className="flex flex-col items-start justify-start"
                  key={paper_code}
                >
                  <label className="text-gray-700 font-medium">{`${papers[paper_code]} ( ${paper_code} )`}</label>
                  <input
                    className="text-black border rounded px-3 py-1 w-full"
                    placeholder={`Enter total marks for ${paper_code}`}
                    value={mark || ""}
                    onChange={(e) =>
                      setMarks({ ...marks, [paper_code]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleUpdateMarks}
              className="px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md"
              disabled={updatingMarks}
            >
              {updatingMarks ? "Updating..." : "Update Total Marks"}
            </button>

            <div className="w-full">
              <input
                type="text"
                className="w-full px-4 py-2 my-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-600"
                placeholder="Search students by name or email..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            {renderStudents()}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledStudents;
