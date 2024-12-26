import { TextareaAutosize } from "@mui/material";
import React from "react";

const TheoryQuestions = ({
  questions,
  selectedAnswers,
  handleAnswerChange,
}) => {
  const handleChange = (questionId, event) => {
    const answer = event.target.value;
    handleAnswerChange(questionId, answer);
  };

  return (
    <div className="space-y-6 mb-32 md:mb-2" id="theory-section">
      {questions.map((question, index) => (
        <div key={question.id} className="border-b-2 border-gray-200 pb-6">
          <p className="font-semibold text-lg text-gray-800">
            {index + 1}. {question.question}
          </p>
          <div className="mt-4 space-y-3">
            <label
              htmlFor={`question-${question.id}`}
              className="block text-gray-700"
            >
              Your Answer:
            </label>
            <TextareaAutosize
              id={`question-${question.id}`}
              value={selectedAnswers[question.id] || ""}
              onChange={(event) => handleChange(question.id, event)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
export default TheoryQuestions;
