import React, { useState } from "react";
import { Button, TextareaAutosize, Typography } from "@mui/material";

const TheryQuestion = ({
  doSubmit,
  handleBack,
  handleNext,
  handleSubmit,
  theoryQuestions: questions,
  setTheoryQuestions: setQuestions,
}) => {
  const [question, setQuestion] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleAddQuestion = () => {
    if (!question.trim()) {
      alert("Question cannot be empty!");
      return;
    }

    if (editingId) {
      // Update question
      setQuestions((prev) =>
        prev.map((q) => (q.id === editingId ? { ...q, text: question } : q))
      );
      setEditingId(null);
    } else {
      // Add new question
      setQuestions([
        ...questions,
        { id: questions.length + 1, text: question },
      ]);
    }

    setQuestion("");
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

  const handleEditQuestion = (id) => {
    const questionToEdit = questions.find((q) => q.id === id);
    if (questionToEdit) {
      setQuestion(questionToEdit.text);
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
          Enter Theory Question
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

          <button
            className="bg-blue-400 px-4 py-2 rounded-lg mt-2"
            onClick={handleAddQuestion}
          >
            {editingId ? "Update Question" : "Add Question"}
          </button>
        </div>

        {/* Scrollable Question List */}
        <div className="flex-grow overflow-y-auto p-4">
          {questions.map((q, i) => (
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

export default TheryQuestion;
