import * as XLSX from "xlsx";

export const exportToExcel = (courseRange, attendanceData) => {
  if (!courseRange) return;

  const { start, end } = courseRange;
  const dateRange = [];
  let currentDate = new Date(start); // Start from the `start` date

  // Generate all dates from start to end
  while (currentDate <= end) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    dateRange.push({
      Date: formattedDate,
      Status: attendanceData[formattedDate] ? "Present" : "Absent",
    });
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  // Prepare Excel data and sheet
  const worksheet = XLSX.utils.json_to_sheet(dateRange);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  // Trigger file download
  XLSX.writeFile(workbook, "Student_Attendance_Report.xlsx");
};
