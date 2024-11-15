import React, { useEffect, useState } from "react";
import "./index.css";
import Calendar from "../../components/calender/Calender";
import { useNavigate, useParams } from "react-router-dom";
import { getAuthToken } from "../../helpers/token";
import axios from "axios";
import { CircularProgress, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const StudentAttendanceReport = () => {
  const [total, setTotal] = useState(0);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [courseRange, setCourseRange] = useState(null);
  const [rangeLoading, setRangeLoading] = useState(false);
  const [years, setYears] = useState([]);
  const navigate = useNavigate();

  const params = useParams();
  const id = params.id;
  const token = getAuthToken();
  if (!token) {
    window.location.href = import.meta.env.VITE_MAIN_URL;
  }

  const fetchCourseRange = async () => {
    setRangeLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/students/course-range?student_id=${id}`,
        {
          headers: {
            "X-Auth-Token": token,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        const start = new Date(response.data?.start);
        const end =
          new Date(response.data?.end) > new Date()
            ? new Date()
            : new Date(response.data?.end);

        setCourseRange({
          start,
          end,
          student: response.data?.student,
        });
        setYears(
          Array.from(
            { length: end.getFullYear() - start.getFullYear() + 1 },
            (_, i) => start.getFullYear() + i
          )
        );
      }
    } catch (error) {
      alert(error?.response?.data?.message);
      console.error("Error fetching course range:", error);
    } finally {
      setRangeLoading(false);
    }
  };

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/attendance/all?student_id=${id}`,
        {
          headers: {
            "X-Auth-Token": token,
          },
        }
      );
      if (response.status === 200) {
        const attendances = {};
        response.data?.attendances.forEach((item) => {
          attendances[item.date] = "present";
        });
        setAttendanceData(attendances);
      }
    } catch (error) {
      alert(error?.response?.data?.message);
      console.error("Error fetching attendance data:", error);
      // Handle error properly (show error message to user, etc.)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAttendances();
      fetchCourseRange();
    }
  }, [id]);

  return (
    <div id="attendance-body">
      <IconButton
        onClick={() => navigate("/attendanceReport")}
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
      <h3 className="text-center">Student Attendance Report</h3>

      {loading ? (
        <div
          style={{ width: "100vw", display: "flex", justifyContent: "center" }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          <Calendar
            setTotal={setTotal}
            id={id}
            attendanceData={attendanceData}
            years={years}
          />
          <div className="footer text-center">
            <span
              style={{
                marginLeft: "10px",
              }}
            >
              Total Attendance:
            </span>
            <span id="total-attendance">{total}</span>
            <span
              className="export-btn"
              style={{
                marginLeft: "10px",
                marginRight: "10px",
                cursor: "pointer",
                color: "#007bff",
                textDecoration: "none",
              }}
              // to="/attendanceReport/excel"
              // state={{ courseRange, attendanceReport: attendanceData }}
              onClick={() =>
                navigate("/attendanceReport/excel", {
                  state: { courseRange, attendanceReport: attendanceData },
                })
              }
            >
              Export ▾
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentAttendanceReport;
