import React, { useState } from "react";

const PracticalQuestions = ({
  questions,
  selectedAnswers,
  handleAnswerChange,
}) => {
  const [errorMessages, setErrorMessages] = useState({});

  const handleFileChange = (questionId, event) => {
    const file = event.target.files[0];
    const allowedTypes = [
      "image/jpeg", // JPEG/JPG
      "image/png", // PNG
      "image/webp", // WEBP
    ];

    if (file) {
      if (allowedTypes.includes(file.type)) {
        handleAnswerChange(questionId, file);
        setErrorMessages((prev) => ({ ...prev, [questionId]: "" })); // Clear error
      } else {
        setErrorMessages((prev) => ({
          ...prev,
          [questionId]:
            "Unsupported file type. Please upload a JPEG, PNG, or WebP image.",
        }));
      }
    }
  };

  return (
    <div className="space-y-6 mb-32 md:mb-2" id="practical-section">
      {questions.map((question, index) => (
        <div key={question.id} className="border-b-2 border-gray-200 pb-6">
          <p className="font-semibold text-lg text-gray-800">
            {index + 1}. {question.question}
          </p>
          <div className="mt-4 space-y-3">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileChange(question.id, e)}
              className="border-2 border-gray-300 p-2 rounded-md"
            />
            {errorMessages[question.id] && (
              <p className="text-red-600 text-sm">
                {errorMessages[question.id]}
              </p>
            )}
            {selectedAnswers[question.id] && !errorMessages[question.id] && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(selectedAnswers[question.id])}
                  alt="Uploaded"
                  className="max-w-xs rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PracticalQuestions;
