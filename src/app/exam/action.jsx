import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import RightSide from "../../components/action/right";
import McqQuestions from "../../components/action/mcq";
import TheoryQuestions from "../../components/action/theory";
import PracticalQuestions from "../../components/action/practical";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import moment from "moment";

const Action = () => {
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [examData, setExamData] = useState(null);

  const [mcqAnswers, setMcqAnswers] = useState(() => {
    const storedAnswers = localStorage.getItem("MCQ_answers");
    return storedAnswers ? JSON.parse(storedAnswers) : {};
  });

  const [theoryAnswers, setTheoryAnswers] = useState(() => {
    const storedAnswers = localStorage.getItem("Theory_answers");
    return storedAnswers ? JSON.parse(storedAnswers) : {};
  });

  const [practicalAnswers, setPracticalAnswers] = useState(() => {
    // const storedAnswers = localStorage.getItem("Practical_answers");
    // return storedAnswers ? JSON.parse(storedAnswers) : {};
    return {};
  });

  const studentId = localStorage.getItem("studentId");
  const examId = localStorage.getItem("examId");

  const [timeLeft, setTimeLeft] = useState(null);
  const [sections, setSections] = useState([]);

  const navigate = useNavigate();

  const fetchExamData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${window.env.VITE_BASE_URL}/api/exam-students/all`,
        {
          params: { studentId, examId },
        }
      );
      //   console.log(response);

      const details = response.data.examDetails;

      if (!details || !details.examination) {
        navigate("/exam/");
        return;
      }
      if (!moment(details.examination?.exam_date).isSame(moment(), "day")) {
        toast.error("The exam date has passed");
        navigate("/exam/");
        return;
      }
      if (details.submitted) {
        toast.warning("You have already submitted the exam");
        navigate("/exam/");
        return;
      }
      setExamData(details);
      // Extract sections based on MCQ, Theory, and Practical
      const { mcq, theory, practical } = details.examination || {};
      const sectionNames = [
        mcq ? "MCQ" : null,
        theory ? "Theory" : null,
        practical ? "Practical" : null,
      ].filter(Boolean);

      setSelectedSection(sectionNames[0]);
      setSections(sectionNames);
      if (details.started_at && details.examination.time_in_seconds) {
        // Calculate remaining time based on started_at and time_in_seconds
        const startTime = new Date(details.started_at);
        const endTime = new Date(
          startTime.getTime() + details.examination.time_in_seconds * 1000
        );

        // Calculate the initial time left
        const initialTimeLeft = endTime - new Date();
        setTimeLeft(initialTimeLeft > 0 ? initialTimeLeft : 0); // Ensure time left is non-negative
      } else {
        navigate("/exam/start");
        return;
      }
    } catch (error) {
      toast.error("Error fetching exam data", error);
      navigate("/exam/");
      return;
    } finally {
      setLoading(false);
    }
  };

  // Fetch the exam data using the API
  useEffect(() => {
    fetchExamData();
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1000;
        } else {
          clearInterval(interval);
          handleSubmit(true);
          return 0;
        }
      });
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [studentId, examId]);

  // Handle tab selection
  const handleTabClick = (section) => setSelectedSection(section);

  // Handle answer changes for each section
  const handleAnswerChange = (setter) => (questionId, value) => {
    setter((prevAnswers) => {
      const newAnswers = {
        ...prevAnswers,
        [questionId]: value,
      };

      // Store answers in localStorage for persistence
      if (selectedSection === "MCQ" || selectedSection === "Theory")
        localStorage.setItem(`MCQ_answers`, JSON.stringify(newAnswers));

      return newAnswers;
    });
  };

  // Upload PDF to API
  const uploadPDF = async (file) => {
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      await axios.post(
        `${window.env.VITE_BASE_URL}/api/exam-students/${examData.id}/upload-pdf`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Answers updated successfully");
    } catch (error) {
      console.error("Error uploading PDF", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const wrapText = (text, maxWidth) => {
      const lines = [];
      const words = text.split("\n"); // Split by new line first
      let currentLine = "";

      words.forEach((word) => {
        const wordArray = word.split(" "); // Now handle space-based word wrapping
        wordArray.forEach((subWord) => {
          const testLine = currentLine ? `${currentLine} ${subWord}` : subWord;
          const testWidth = doc.getTextWidth(testLine);

          if (testWidth <= maxWidth) {
            currentLine = testLine;
          } else {
            lines.push(currentLine);
            currentLine = subWord; // Start a new line with the current word
          }
        });
        if (currentLine) {
          lines.push(currentLine);
          currentLine = ""; // Reset currentLine after a complete line
        }
      });

      return lines;
    };

    const addNewPage = () => {
      doc.addPage();
      return margin; // Reset yPosition for the new page
    };

    const addSectionTitle = (title, yPosition) => {
      doc.setFontSize(16);
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, yPosition);
      return yPosition + 10; // Update yPosition and return it
    };

    try {
      if (!examData) return;

      const { examination } = examData;
      let yPosition = margin; // Initialize yPosition here

      // Theory Section
      if (examination.theory) {
        yPosition = addSectionTitle("Theory Section", yPosition);

        examination.theory_question.question_details.forEach(
          (question, index) => {
            const maxLineWidth = pageWidth - 2 * margin;
            const questionText = `${index + 1}. ${question.question}`;
            const wrappedQuestion = wrapText(questionText, maxLineWidth);

            doc.setFontSize(12);
            wrappedQuestion.forEach((line) => {
              doc.text(line, margin, yPosition);
              yPosition += 6;
              if (yPosition + 6 > pageHeight - margin) {
                yPosition = addNewPage();
              }
            });

            const answer = theoryAnswers[question.id] || "No answer";
            const wrappedAnswer = wrapText(answer, maxLineWidth);
            yPosition += 6;
            doc.text(`Answer:`, margin, yPosition);
            yPosition += 6;
            wrappedAnswer.forEach((line) => {
              doc.text(line, margin, yPosition);
              yPosition += 6;
              if (yPosition + 6 > pageHeight - margin) {
                yPosition = addNewPage();
              }
            });

            yPosition += 12; // Add space between Q&A
            if (yPosition + 12 > pageHeight - margin) {
              yPosition = addNewPage();
            }
          }
        );
      }

      // MCQ Section
      if (examination.mcq) {
        yPosition = addNewPage();
        yPosition = addSectionTitle("MCQ Section", yPosition);

        examination.mcq_question.question_details.forEach((question, index) => {
          const maxLineWidth = pageWidth - 2 * margin;
          const questionText = `${index + 1}. ${question.question}`;
          const wrappedQuestion = wrapText(questionText, maxLineWidth);

          doc.setFontSize(12);
          wrappedQuestion.forEach((line) => {
            doc.text(line, margin, yPosition);
            yPosition += 6;
            if (yPosition + 6 > pageHeight - margin) {
              yPosition = addNewPage();
            }
          });

          const answer = mcqAnswers[question.id] || "No answer";
          doc.text(`Answer: ${answer}`, margin, yPosition);
          yPosition += 12;
          if (yPosition + 12 > pageHeight - margin) {
            yPosition = addNewPage();
          }
        });
      }

      // Practical Section
      let index = 0;
      if (examination.practical) {
        yPosition = addNewPage();
        yPosition = addSectionTitle("Practical Section", yPosition);

        for (const question of examination.practical_question
          .question_details) {
          const maxLineWidth = pageWidth - 2 * margin;
          const questionText = `${++index}. ${question.question}`;
          const wrappedQuestion = wrapText(questionText, maxLineWidth);

          doc.setFontSize(12);
          wrappedQuestion.forEach((line) => {
            doc.text(line, margin, yPosition);
            yPosition += 6;
            if (yPosition + 6 > pageHeight - margin) {
              yPosition = addNewPage();
            }
          });

          const answer = practicalAnswers[question.id];
          if (answer instanceof File) {
            const base64Image = await fileToBase64(answer);
            if (base64Image) {
              const image = new Image();
              image.src = `data:image/jpeg;base64,${base64Image}`;

              await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
              });

              const imgWidth = pageWidth - 2 * margin;
              const imgHeight = (image.height / image.width) * imgWidth;

              if (yPosition + imgHeight > pageHeight - margin) {
                yPosition = addNewPage();
              }

              doc.addImage(
                image,
                "JPEG",
                margin,
                yPosition,
                imgWidth,
                imgHeight
              );
              yPosition += imgHeight + 6;
            }
          } else {
            const textAnswer = answer
              ? "Answer: File Uploaded"
              : "Answer: No answer";
            doc.text(textAnswer, margin, yPosition);
            yPosition += 12;
            if (yPosition + 12 > pageHeight - margin) {
              yPosition = addNewPage();
            }
          }
        }
      }

      // Save the PDF
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const file = new File(
        [pdfBlob],
        `exam-answers-${examId}-${studentId}.pdf`,
        {
          type: "application/pdf",
        }
      );

      await uploadPDF(file);
    } catch (error) {
      console.error("Error generating or uploading PDF", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Remove the data URL part
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file); // Convert file to Base64
    });
  };

  // Render the selected section
  const renderSectionComponent = () => {
    if (!examData) {
      return <p>Loading exam data...</p>;
    }

    const { examination } = examData;

    switch (selectedSection) {
      case "MCQ":
        return (
          <McqQuestions
            questions={examination.mcq_question.question_details}
            selectedAnswers={mcqAnswers}
            handleAnswerChange={handleAnswerChange(setMcqAnswers)}
          />
        );
      case "Theory":
        return (
          <TheoryQuestions
            questions={examination.theory_question.question_details}
            selectedAnswers={theoryAnswers}
            handleAnswerChange={handleAnswerChange(setTheoryAnswers)}
          />
        );
      case "Practical":
        return (
          <PracticalQuestions
            questions={examination.practical_question.question_details}
            selectedAnswers={practicalAnswers}
            handleAnswerChange={handleAnswerChange(setPracticalAnswers)}
          />
        );
      default:
        return <p>No section selected.</p>;
    }
  };

  const saveProgress = () => {
    generatePDF();
  };

  const handleSubmit = async (force = false) => {
    console.log(force);
    if (!force) {
      const result = window.confirm(
        "Are you sure you want to submit. Once you have submitted you can't reappear the exam"
      );
      if (!result) return;
    }
    try {
      generatePDF();
      const response = await axios.post(
        `${window.env.VITE_BASE_URL}/api/exam-students/${examData.id}/submit`
      );
      if (response.status === 200) {
        toast.success("Exam Submitted successfully");
        navigate("/exam/");
      } else {
        toast.error(response?.data?.message || "Unsuccessful submission");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit exam. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Time Bar for Mobile */}
      <div className="md:hidden bg-gradient-to-r from-blue-500 to-teal-400 text-white p-4">
        <div className="text-center">
          {timeLeft > 0 ? (
            <div className="text-xl font-semibold">
              Remaining Time: {Math.floor(timeLeft / 3600000)}h{" "}
              {Math.floor((timeLeft % 3600000) / 60000)}m{" "}
              {Math.floor((timeLeft % 60000) / 1000)}s
            </div>
          ) : (
            <div className="text-xl font-semibold">Time is up!</div>
          )}
        </div>
      </div>

      {/* Left Side: Tabs and Questions */}
      <div className="w-full md:w-2/3 p-4 md:p-6">
        {/* Section Tabs */}
        <div className="mb-4 flex flex-wrap space-x-2 md:space-x-4">
          {sections.map((section) => (
            <button
              key={section}
              className={`px-4 py-2 rounded-lg border-2 ${
                selectedSection === section
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => handleTabClick(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Questions Section */}
        <div className="text-black">{renderSectionComponent()}</div>
      </div>

      {/* Right Side: Hidden on Mobile */}
      <div className="hidden md:block w-full md:w-1/3 p-4 md:p-6">
        <RightSide timeLeft={timeLeft} sections={sections} />
        <div className="flex justify-between m-2">
          <button
            onClick={saveProgress}
            className="w-1/2 mr-2 bg-green-500 text-white py-3 rounded-lg"
          >
            Save Progress
          </button>
          <button
            onClick={() => handleSubmit()}
            className="w-1/2 ml-2 bg-blue-500 text-white py-3 rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Bottom Buttons for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg flex justify-between">
        <button
          onClick={saveProgress}
          className="w-1/2 mr-2 bg-green-500 text-white py-3 rounded-lg"
        >
          Save Progress
        </button>
        <button
          onClick={() => handleSubmit()}
          className="w-1/2 ml-2 bg-blue-500 text-white py-3 rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Action;
