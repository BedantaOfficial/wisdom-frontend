import React, { forwardRef } from "react";
import { toAlphabet } from "../../helpers/number";

const McqQuestions = forwardRef(
  ({ questions, selectedAnswers, handleAnswerChange }, ref) => {
    return (
      <div className="space-y-6" id="mcq-section" ref={ref}>
        {questions.map((question, index) => (
          <div key={question.id} className="border-b-2 border-gray-200 pb-6">
            <p className="font-semibold text-lg text-gray-800">
              {index + 1}. {question.question}
            </p>
            <div className="mt-4 space-y-3">
              {question.options.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <label className="inline-flex items-center text-gray-700 hover:text-blue-500">
                    <span className="font-medium">
                      {toAlphabet(index + 1)}.
                    </span>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.option}
                      checked={selectedAnswers[question.id] === option.option}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                      className="mr-3 w-4 h-4 border-gray-300 rounded-full cursor-pointer focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2">{option.option}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

export default McqQuestions;
