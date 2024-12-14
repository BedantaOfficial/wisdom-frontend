import { Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getAuthToken } from "../../helpers/token";
import { Checkbox, DatePicker } from "antd";
// import "antd/dist/reset.css";
import moment from "moment";

const SecondStep = ({
  handleBack,
  handleNext,
  selectedCourse,
  setSelectedCourse,
  selectedSemester,
  setSelectedSemester,
  examDate,
  setExamDate,
  examTime,
  setExamTime,
  paperTypes,
  setPaperTypes,
}) => {
  const token = getAuthToken();
  if (!token) {
    window.location.href = import.meta.env.VITE_MAIN_URL;
  }

  const [loading, setLoading] = useState(false);
  const [fetchedCourses, setFetchedCourses] = useState([]);
  console.log(selectedCourse, selectedSemester);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/courses`,
        {
          headers: {
            "X-Auth-Token": `${token}`,
          },
        }
      );
      if (response.status === 200) {
        setFetchedCourses(response.data?.courses || []);
      } else {
        setFetchedCourses([]);
      }
    } catch (error) {
      console.error(error);
      setFetchedCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const courses = fetchedCourses?.map((course) => ({
    id: course.id,
    name: course.name,
    papers: course.papers || [],
  }));

  const semesters = selectedCourse
    ? [...new Set(selectedCourse.papers?.map((paper) => paper.semester))]
    : [];

  const papers =
    selectedCourse && selectedSemester
      ? selectedCourse.papers?.filter(
          (paper) => paper.semester === selectedSemester
        )
      : [];

  const handleTimeChange = (field, value) => {
    setExamTime((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (!selectedCourse || !selectedSemester) {
      alert("Please select a course and semester!");
      return;
    }
    if (!examTime.hours || !examTime.minutes) {
      alert("Please set the exam time!");
      return;
    }
    if (!examDate) {
      alert("Please select an exam date!");
      return;
    }
    if (!paperTypes.theory && !paperTypes.practical && !paperTypes.mcq) {
      alert("Please select at least one type of paper!");
      return;
    }
    handleNext();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center bg-gray-100 py-2 text-black">
      <div className="max-w-[500px] w-[95%] bg-gray-300 rounded-lg shadow-lg h-[95%] overflow-hidden p-4">
        <div className="my-3">
          <label>Enter Exam Date</label>
          <input
            type="date"
            value={examDate}
            placeholder="Enter exam date"
            onChange={(date) => setExamDate(date.target.value)}
            min={moment().format("YYYY-MM-DD")} // Disable past dates
            className="text-gray-800 border border-gray-300 rounded-lg p-2"
            style={{ width: "100%", height: 50 }}
          />
        </div>
        <div className="flex flex-col my-3">
          <Checkbox
            checked={paperTypes.theory}
            onChange={(e) =>
              setPaperTypes((prev) => ({
                ...prev,
                theory: e.target.checked,
              }))
            }
          >
            Theory
          </Checkbox>
          <Checkbox
            checked={paperTypes.practical}
            onChange={(e) =>
              setPaperTypes((prev) => ({
                ...prev,
                practical: e.target.checked,
              }))
            }
          >
            Practical
          </Checkbox>
          <Checkbox
            checked={paperTypes.mcq}
            onChange={(e) =>
              setPaperTypes((prev) => ({
                ...prev,
                mcq: e.target.checked,
              }))
            }
          >
            MCQ
          </Checkbox>
        </div>
        <Select
          value={selectedCourse?.id || ""}
          onChange={(e) => {
            setSelectedCourse(
              courses.find((course) => course.id === e.target.value) || null
            );
            setSelectedSemester("");
          }}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            Select Course
          </MenuItem>
          {courses.map((course) => (
            <MenuItem key={course.id} value={course.id}>
              {course.name}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={selectedSemester || ""}
          onChange={(e) => setSelectedSemester(e.target.value)}
          displayEmpty
          fullWidth
          disabled={!selectedCourse}
          className="mt-4"
        >
          <MenuItem value="" disabled>
            Select Semester
          </MenuItem>
          {semesters.map((semester) => (
            <MenuItem key={semester} value={semester}>
              Semester {semester}
            </MenuItem>
          ))}
        </Select>

        <Typography variant="h6" className="mt-6" gutterBottom>
          Set Exam Time
        </Typography>
        <div className="flex gap-4">
          <TextField
            label="Hours"
            type="number"
            value={examTime.hours}
            onChange={(e) => handleTimeChange("hours", e.target.value)}
            fullWidth
          />
          <TextField
            label="Minutes"
            type="number"
            value={examTime.minutes}
            onChange={(e) => handleTimeChange("minutes", e.target.value)}
            fullWidth
          />
        </div>

        <Typography variant="h6" className="mt-6" gutterBottom>
          Papers
        </Typography>
        <div className="mt-2">
          {papers.length > 0 ? (
            papers.map((paper) => (
              <Typography key={paper.id}>
                {paper.paper_code} - {paper.name}
              </Typography>
            ))
          ) : (
            <Typography>
              No papers available for the selected semester.
            </Typography>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="max-w-[500px] w-[95%] h-[10%] flex items-center justify-between py-2">
        <Button
          sx={{
            borderColor: "#1e40af",
            color: "#1e40af",
            "&:hover": {
              backgroundColor: "#1e40af",
              color: "#fff",
            },
          }}
          variant="outlined"
          onClick={handleBack}
        >
          Prev
        </Button>
        <Button
          sx={{
            backgroundColor: "#3b82f6",
            color: "white",
            "&:hover": {
              backgroundColor: "#2563eb",
            },
          }}
          variant="contained"
          onClick={handleNextStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SecondStep;
