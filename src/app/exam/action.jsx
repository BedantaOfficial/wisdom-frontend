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

const Action = () => {
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [examData, setExamData] = useState(null);

  const [mcqAnswers, setMcqAnswers] = useState(() => {
    const storedAnswers = localStorage.getItem("MCQ_answers");
    return storedAnswers ? JSON.parse(storedAnswers) : {};
  });

  const [theoryAnswers, setTheoryAnswers] = useState(() => {
    //   const storedAnswers = localStorage.getItem('Theory_answers');
    //   return storedAnswers ? JSON.parse(storedAnswers) : {};
    return {};
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

  // Refs for each section
  const mcqRef = useRef(null);
  const theoryRef = useRef(null);
  const practicalRef = useRef(null);

  const fetchExamData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/exam-students/all`,
        {
          params: { studentId, examId },
        }
      );
      const details = response.data.examDetails;
      if (details.submitted) {
        toast.warning("You have already submitted the exam");
        navigate("/exam/");
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
      }
    } catch (error) {
      console.error("Error fetching exam data", error);
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
      if (selectedSection === "MCQ")
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
        `${import.meta.env.VITE_BASE_URL}/api/exam-students/${
          examData.id
        }/upload-pdf`,
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
    try {
      if (!examData) return;

      const { examination } = examData;

      // Title for the PDF
      //   doc.setFontSize(18);
      //   doc.text("Exam Answer Sheet", 10, 10);
      //   doc.setFontSize(12);
      let yPosition = 20;

      // MCQ Section
      //   doc.addPage(); // Start a new page for the MCQ section
      const mcqSectionTitle = "MCQ Section";
      doc.setFontSize(16);
      const mcqTitleWidth =
        doc.getStringUnitWidth(mcqSectionTitle) * doc.internal.scaleFactor;
      doc.text(
        mcqSectionTitle,
        (doc.internal.pageSize.width - mcqTitleWidth) / 2,
        yPosition
      ); // Center the title
      yPosition += 10;

      examination.mcq_question.question_details.forEach((question, index) => {
        const answer = mcqAnswers[question.id];
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${question.question}`, 10, yPosition);
        yPosition += 6;
        doc.text(`Answer: ${answer || "No answer"}`, 10, yPosition);
        yPosition += 12;
      });

      // Theory Section
      doc.addPage(); // Start a new page for the Theory section
      yPosition = 20;
      const theorySectionTitle = "Theory Section";
      doc.setFontSize(16);
      const theoryTitleWidth =
        doc.getStringUnitWidth(theorySectionTitle) * doc.internal.scaleFactor;
      doc.text(
        theorySectionTitle,
        (doc.internal.pageSize.width - theoryTitleWidth) / 2,
        yPosition
      ); // Center the title
      yPosition += 10;

      for (const [
        index,
        question,
      ] of examination.theory_question.question_details.entries()) {
        const answer = theoryAnswers[question.id];

        doc.setFontSize(12);
        doc.text(`${index + 1}. ${question.question}`, 10, yPosition);
        yPosition += 6;

        if (answer) {
          // If answer is a File object (image)
          if (answer instanceof File) {
            const base64Image = await fileToBase64(answer);
            if (base64Image) {
              const image = new Image();
              image.src = `data:image/jpeg;base64,${base64Image}`; // Create image from base64

              // Wait for the image to load
              await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
              });

              // Get the original image size
              const imgWidth = image.naturalWidth;
              const imgHeight = image.naturalHeight;

              // Calculate the maximum width and height based on available page space
              const maxWidth = doc.internal.pageSize.width - 20; // 10px margin on each side
              const maxHeight = doc.internal.pageSize.height - yPosition - 10; // Allow some space for other content

              // Calculate aspect ratio and resize image accordingly
              let scaleFactor = Math.min(
                maxWidth / imgWidth,
                maxHeight / imgHeight
              );

              // Apply the scale factor to both width and height
              const scaledWidth = imgWidth * scaleFactor;
              const scaledHeight = imgHeight * scaleFactor;

              // Insert the image in the PDF while maintaining the original aspect ratio
              doc.text("Answer:", 10, yPosition); // Optional text for answer
              yPosition += 6;
              doc.addImage(
                image,
                "JPEG",
                10,
                yPosition,
                scaledWidth,
                scaledHeight
              ); // Insert scaled image
              yPosition += scaledHeight + 6; // Adjust y-position after image
            }
          } else {
            doc.text("Answer: File Uploaded", 10, yPosition); // For non-image files
            yPosition += 12;
          }
        } else {
          doc.text("Answer: No answer", 10, yPosition);
          yPosition += 12;
        }
      }

      // Practical Section
      doc.addPage(); // Start a new page for the Practical section
      yPosition = 20;
      const practicalSectionTitle = "Practical Section";
      doc.setFontSize(16);
      const practicalTitleWidth =
        doc.getStringUnitWidth(practicalSectionTitle) *
        doc.internal.scaleFactor;
      doc.text(
        practicalSectionTitle,
        (doc.internal.pageSize.width - practicalTitleWidth) / 2,
        yPosition
      ); // Center the title
      yPosition += 10;

      for (const [
        index,
        question,
      ] of examination.practical_question.question_details.entries()) {
        const answer = practicalAnswers[question.id];

        doc.setFontSize(12);
        doc.text(`${index + 1}. ${question.question}`, 10, yPosition);
        yPosition += 6;

        if (answer) {
          // If answer is a File object (image)
          if (answer instanceof File) {
            const base64Image = await fileToBase64(answer);
            if (base64Image) {
              const image = new Image();
              image.src = `data:image/jpeg;base64,${base64Image}`; // Create image from base64

              // Wait for the image to load
              await new Promise((resolve, reject) => {
                image.onload = resolve;
                image.onerror = reject;
              });

              // Get the original image size
              const imgWidth = image.naturalWidth;
              const imgHeight = image.naturalHeight;

              // Calculate the maximum width and height based on available page space
              const maxWidth = doc.internal.pageSize.width - 20; // 10px margin on each side
              const maxHeight = doc.internal.pageSize.height - yPosition - 10; // Allow some space for other content

              // Calculate aspect ratio and resize image accordingly
              let scaleFactor = Math.min(
                maxWidth / imgWidth,
                maxHeight / imgHeight
              );

              // Apply the scale factor to both width and height
              const scaledWidth = imgWidth * scaleFactor;
              const scaledHeight = imgHeight * scaleFactor;

              // Insert the image in the PDF while maintaining the original aspect ratio
              doc.text("Answer:", 10, yPosition); // Optional text for answer
              yPosition += 6;
              doc.addImage(
                image,
                "JPEG",
                10,
                yPosition,
                scaledWidth,
                scaledHeight
              ); // Insert scaled image
              yPosition += scaledHeight + 6; // Adjust y-position after image
            }
          } else {
            doc.text("Answer: File Uploaded", 10, yPosition); // For non-image files
            yPosition += 12;
          }
        } else {
          doc.text("Answer: No answer", 10, yPosition);
          yPosition += 12;
        }
      }

      // Save the PDF
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);
      //   window.open(pdfUrl, "_blank");
      const file = new File(
        [pdfBlob],
        `exam-answers-${examId}-${studentId}.pdf`,
        {
          type: "application/pdf",
        }
      );

      await uploadPDF(file);
      //   alert("PDF uploaded successfully!");
    } catch (error) {
      console.error("Error generating or uploading PDF", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Helper function to convert File to Base64
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
    generatePDF();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/exam-students/${
          examData.id
        }/submit`
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
