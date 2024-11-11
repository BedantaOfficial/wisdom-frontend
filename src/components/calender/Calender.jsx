import React, { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - 5 + i
);

const Calendar = ({ setTotal, id }) => {
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedYear, setSelectedYear] = useState();
  const [attendanceData, setAttendanceData] = useState({});

  const firstDay = () => new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = () =>
    new Date(selectedYear, selectedMonth + 1, 0).getDate();

  const handleChangeMonthByStep = (step) => {
    let changedMonth = selectedMonth + step;
    if (changedMonth < 0) {
      setSelectedYear((prev) => prev - 1);
      setSelectedMonth(11);
    } else if (changedMonth > 11) {
      setSelectedYear((prev) => prev + 1);
      setSelectedMonth(0);
    } else setSelectedMonth(changedMonth);
  };

  const getClassNamesForDay = (day) => {
    const dateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    let classList = "calendar-day ";

    const today = new Date();
    if (
      selectedYear === today.getFullYear() &&
      selectedMonth === today.getMonth() &&
      day === today.getDate()
    ) {
      classList += "today ";
    }

    if (attendanceData[dateKey] === "present") {
      classList += "present ";
    }
    //  if (attendanceData[dateKey] === "absent")
    else {
      classList += "absent ";
    }

    return classList;
  };

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/attendance?student_id=${id}&month=${
          selectedMonth + 1
        }&year=${selectedYear}`
      );
      if (response.status === 200) {
        const attendance = {};
        let total = 0;
        response.data?.attendance.forEach((item) => {
          attendance[item.date] = item.status;
          if (attendance[item.date] === "present") total++;
        });
        setTotal(total);
        setAttendanceData(attendance);
      }
    } catch (error) {
      alert(error?.response?.data?.message);
      console.error("Error fetching attendance data:", error);
      // Handle error properly (show error message to user, etc.)
    }
  };

  useEffect(() => {
    console.log(selectedMonth, selectedYear);
    if (id && selectedMonth && selectedYear) {
      fetchAttendance();
    }
  }, [selectedMonth, selectedYear, id]);

  useEffect(() => {
    setSelectedMonth(new Date().getMonth());
    setSelectedYear(new Date().getFullYear());
  }, []);

  const monthDays = () => {
    const days = [];
    for (let day = 1; day <= daysInMonth(); day++) {
      days.push(
        <div key={day} className={getClassNamesForDay(day)}>
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => handleChangeMonthByStep(-1)}>◀</button>
        <div>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {monthNames.map((month, index) => (
              <option value={index} key={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {years.map((year) => (
              <option value={year} key={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <button onClick={() => handleChangeMonthByStep(1)}>▶</button>
      </div>
      <div className="calendar-grid" id="calendar">
        <div className="day-header">SUN</div>
        <div className="day-header">MON</div>
        <div className="day-header">TUE</div>
        <div className="day-header">WED</div>
        <div className="day-header">THU</div>
        <div className="day-header">FRI</div>
        <div className="day-header">SAT</div>

        {Array.from({ length: firstDay() }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {monthDays()}
      </div>
    </div>
  );
};

export default Calendar;
