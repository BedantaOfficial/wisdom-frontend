import React from "react";

const StatementSheet = () => {
  return (
    <div className="w-[850px] mx-auto p-6 bg-blue-50 border-2 border-blue-300 rounded-md shadow-lg text-sm text-blue-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Alma World Limited</h1>
          <p className="text-xs italic">IQC Certified A British Company</p>
        </div>
        <img
          src="/alma-logo.png"
          alt="ALMA Logo"
          className="h-12 object-contain"
        />
      </div>
      <h2 className="text-center font-bold bg-blue-500 text-white py-2 mt-4 uppercase">
        Statement Sheet
      </h2>

      {/* Student Details */}
      <div className="border-2 border-blue-300 p-4 mt-4 space-y-2">
        <p>
          <strong>Name:</strong> ______________________
        </p>
        <p>
          <strong>Date of Birth:</strong> ______________{" "}
          <strong>F/H/G Name:</strong> ________________________
        </p>
        <p>
          <strong>Course:</strong> ________________ <strong>Duration:</strong>{" "}
          ________________
        </p>
        <p>
          <strong>Exam Date:</strong> ________________{" "}
          <strong>Enrol. No:</strong> ________________ <strong>Roll No:</strong>{" "}
          ________________
        </p>
      </div>

      {/* Table */}
      <div className="mt-4">
        <table className="w-full border-collapse border-2 border-blue-300 text-center text-blue-900  bg-transparent">
          <thead>
            <tr className=" bg-blue-100 !important">
              <th className="border border-blue-300 px-2 py-1">Paper Code</th>
              <th className="border border-blue-300 px-2 py-1">Subject(s)</th>
              <th className="border border-blue-300 px-2 py-1">Max. Marks</th>
              <th className="border border-blue-300 px-2 py-1">Min. Marks</th>
              <th className="border border-blue-300 px-2 py-1">
                Marks Obtained
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Semester I */}
            <tr className="bg-blue-200 font-semibold">
              <td
                colSpan={5}
                className="border border-blue-300 px-2 py-1 text-left pl-4"
              >
                Sem - I
              </td>
            </tr>
            {Array(5)
              .fill(null)
              .map((_, idx) => (
                <tr key={idx}>
                  <td className="border border-blue-300 px-2 py-1"></td>
                  <td className="border border-blue-300 px-2 py-1"></td>
                  <td className="border border-blue-300 px-2 py-1">100</td>
                  <td className="border border-blue-300 px-2 py-1">33</td>
                  <td className="border border-blue-300 px-2 py-1"></td>
                </tr>
              ))}

            {/* Semester II */}
            <tr className="bg-blue-200 font-semibold">
              <td
                colSpan={5}
                className="border border-blue-300 px-2 py-1 text-left pl-4"
              >
                Sem - II
              </td>
            </tr>
            {Array(5)
              .fill(null)
              .map((_, idx) => (
                <tr key={idx}>
                  <td className="border border-blue-300 px-2 py-1"></td>
                  <td className="border border-blue-300 px-2 py-1"></td>
                  <td className="border border-blue-300 px-2 py-1">100</td>
                  <td className="border border-blue-300 px-2 py-1">33</td>
                  <td className="border border-blue-300 px-2 py-1"></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="font-bold">SEMESTER</p>
            <p>Total Marks Obtained</p>
            <p>Max. Marks</p>
          </div>
          <div>
            <p className="font-bold">PERCENTAGE</p>
            <p></p>
          </div>
          <div>
            <p className="font-bold">RESULT</p>
            <p></p>
          </div>
        </div>

        <div className="mt-4 text-xs">
          <p>
            <strong>Notes:</strong>
          </p>
          <ul className="list-disc pl-4">
            <li>This is only for issuing certificates/diplomas.</li>
            <li>
              For certification of marks, the institution issues proper grade
              sheets.
            </li>
          </ul>
          <p className="mt-2">
            <strong>Declaration:</strong> I hereby declare that the candidate
            has completed the syllabus.
          </p>
        </div>

        <div className="flex justify-between mt-6">
          <div>
            <p>Centre Code: ___________</p>
            <p>Centre Name: ___________</p>
            <p>Alma email id: ___________</p>
          </div>
          <div className="text-center">
            <p>Sign & Seal of Centre Head</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatementSheet;
