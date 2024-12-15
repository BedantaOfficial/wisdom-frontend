import React from "react";

const PracticalQuestions = ({
  questions,
  selectedAnswers,
  handleAnswerChange,
}) => {
  const handleFileChange = (questionId, event) => {
    const file = event.target.files[0];
    if (file) {
      handleAnswerChange(questionId, file);
    }
  };

  return (
    <div className="space-y-6" id="practical-section">
      {questions.map((question, index) => (
        <div key={question.id} className="border-b-2 border-gray-200 pb-6">
          <p className="font-semibold text-lg text-gray-800">
            {index + 1}. {question.question}
          </p>
          <div className="mt-4 space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(question.id, e)}
              className="border-2 border-gray-300 p-2 rounded-md"
            />
            {selectedAnswers[question.id] && (
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
