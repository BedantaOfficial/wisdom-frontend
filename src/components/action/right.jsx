import React from "react";

const RightSide = ({ timeLeft, sections }) => {
  // Convert remaining time to hours, minutes, and seconds
  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="flex flex-col w-full sm:w-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      {/* Remaining Time Section */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-lg p-4 sm:p-6 shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3">
          Remaining Time
        </h2>
        <div className="text-lg sm:text-3xl font-bold">
          {timeLeft > 0 ? (
            <span className="flex items-center space-x-2">
              <div className="text-base sm:text-xl font-semibold">{hours}h</div>
              <div className="text-base sm:text-xl font-semibold">
                {minutes}m
              </div>
              <div className="text-base sm:text-xl font-semibold">
                {seconds}s
              </div>
            </span>
          ) : (
            <span className="text-base sm:text-xl font-semibold">
              Time is up!
            </span>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="mt-4 sm:mt-6">
        <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-3">
          Sections
        </h2>
        <ul className="space-y-1 sm:space-y-2">
          {sections.map((section, index) => (
            <li key={index} className="text-sm sm:text-lg text-gray-600">
              - {section}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RightSide;
