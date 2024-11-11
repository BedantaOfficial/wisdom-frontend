import React, { useState } from "react";
import "./index.css";
import Calendar from "../../components/calender/Calender";
import { useParams } from "react-router-dom";
const StudentAttendanceReport = () => {
  const [total, setTotal] = useState(0);
  const params = useParams();
  const id = params.id;

  return (
    <div id="attendance-body">
      <h3 className="text-center">Student Attendance Report</h3>

      <Calendar setTotal={setTotal} id={id} />
      <div className="footer text-center">
        Total Attendance: <span id="total-attendance">{total}</span>
        <span className="export-btn">Export ▾</span>
      </div>
    </div>
  );
};

export default StudentAttendanceReport;
