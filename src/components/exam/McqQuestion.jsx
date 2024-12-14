import React, { useState } from "react";
import { Button, TextareaAutosize, Typography } from "@mui/material";
import { toAlphabet } from "../../helpers/number";

const McqQuestion = ({
  doSubmit,
  handleBack,
  handleNext,
  handleSubmit,
  mcqQuestions: questions,
  setMcqQuestions: setQuestions,
}) => {
  const [options, setOptions] = useState([]);
  const [question, setQuestion] = useState("");
  const [option, setOption] = useState("");
  const [editingId, setEditingId] = useState(null); // Tracks the ID of the question being edited

  const handleAddQuestion = () => {
    if (!question.trim()) {
      alert("Question cannot be empty!");
      return;
    }
    if (options.length < 2) {
      alert("A question must have at least two options!");
      return;
    }
    if (editingId) {
      // Update question
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingId
            ? { ...q, text: question, options: [...options] }
            : q
        )
      );
      setEditingId(null);
    } else {
      // Add new question
      setQuestions([
        ...questions,
        { id: questions.length + 1, text: question, options: [...options] },
      ]);
    }
    setQuestion("");
    setOptions([]);
  };

  const handleAddOption = () => {
    if (!option.trim()) {
      alert("Option cannot be empty!");
      return;
    }
    if (options.includes(option.trim())) {
      alert("Option already exists!");
      return;
    }
    setOptions([...options, option]);
    setOption("");
  };

  const handleDeleteQuestion = (id) => {
    setQuestions((prevQuestions) =>
      prevQuestions
        .filter((q) => q.id !== id)
        .map((q, index) => ({
          ...q,
          id: index + 1,
        }))
    );
  };

  const handleDeleteOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleEditQuestion = (id) => {
    const questionToEdit = questions.find((q) => q.id === id);
    if (questionToEdit) {
      setQuestion(questionToEdit.text);
      setOptions([...questionToEdit.options]);
      setEditingId(id);
    }
  };

  const handleNextStep = () => {
    if (questions.length === 0) {
      alert("Please add at least one question!");
      return;
    }
    if (doSubmit) {
      handleSubmit();
    } else {
      handleNext();
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center bg-gray-100 py-2 text-black">
      <div className="max-w-[500px] w-[95%] bg-gray-300 rounded-lg shadow-lg h-[95%] overflow-hidden flex flex-col">
        {/* Fixed Header */}
        <Typography
          variant="h5"
          className="bg-blue-100 text-blue-800 p-2 rounded-lg shadow-lg font-semibold text-center hover:bg-blue-200 transition-all duration-300"
        >
          Enter MCQ Question
        </Typography>

        {/* Input Section */}
        <div className="w-full flex flex-col gap-2 bg-green-100 p-4 items-center sticky top-0 z-10 my-2">
          <TextareaAutosize
            type="text"
            placeholder="Enter Question"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            minRows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="w-full flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter Option"
              className="flex-grow px-4 h-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={option}
              onChange={(e) => setOption(e.target.value)}
            />
            <button
              className="bg-green-400 px-4 h-14 rounded-lg"
              onClick={handleAddOption}
            >
              Add Option
            </button>
          </div>
          {/* Display Added Options */}
          <ul className="w-full">
            {options.map((opt, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-white rounded-lg shadow-sm px-4 py-2 mt-1"
              >
                {opt}
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteOption(index)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <button
            className="bg-blue-400 px-4 py-2 rounded-lg mt-2"
            onClick={handleAddQuestion}
          >
            {editingId ? "Update Question" : "Add Question"}
          </button>
        </div>

        {/* Scrollable Question List */}
        <div className="flex-grow overflow-y-auto p-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-lg shadow-lg p-4 mb-4 flex flex-col"
            >
              <Typography
                variant="body1"
                className="font-semibold text-gray-800"
              >
                {q.id}. {q.text}
              </Typography>
              <ul className="mt-2">
                {q.options.map((opt, index) => (
                  <li key={index} className="text-gray-600">
                    &nbsp;&nbsp;&nbsp;
                    {toAlphabet(index + 1, true)}. {opt}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 mt-2">
                <button
                  className="text-blue-500"
                  onClick={() => handleEditQuestion(q.id)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDeleteQuestion(q.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-[500px] w-[95%] h-[10%] flex items-center justify-between py-2">
        <Button
          sx={{
            borderColor: "#1e40af",
            color: "#1e40af",
            "&:hover": {
              backgroundColor: "#1e40af",
              color: "#fff",
            },
          }}
          variant="outlined"
          onClick={handleBack}
        >
          Prev
        </Button>
        <Button
          sx={{
            backgroundColor: doSubmit ? "#8e1111" : "#3d70dd",
            color: "white",
            "&:hover": {
              backgroundColor: doSubmit ? "#eb2525" : "#2563eb",
            },
          }}
          variant="contained"
          onClick={handleNextStep}
        >
          {doSubmit ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default McqQuestion;
