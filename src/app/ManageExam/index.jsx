import React, { useState } from "react";
import FirstStep from "../../components/exam/FirstStep";
import SecondStep from "../../components/exam/SecondStep";
import TheryQuestion from "../../components/exam/TheryQuestion";
import PracticalQuestion from "../../components/exam/PracticalQuestion";
import McqQuestion from "../../components/exam/McqQuestion";
import { getAuthToken } from "../../helpers/token";
import { useNavigate } from "react-router-dom";
import { toSeconds } from "../../helpers/time";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";

const ManageExam = () => {
  const navigate = useNavigate();
  const token = getAuthToken();
  console.log(token);
  if (!token) {
    window.location.href = import.meta.env.VITE_MAIN_URL;
  }
  const [currentStep, setCurrentStep] = useState(0);
  // Available paper types
  const [paperTypes, setPaperTypes] = useState({
    theory: true,
    practical: true,
    mcq: true,
  });
  // Selected students
  const [selectedStudents, setSelectedStudents] = useState([]);
  // Exam date
  const [examDate, setExamDate] = useState("");
  // Selected Course and semester
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  // Exam Time
  const [examTime, setExamTime] = useState({ hours: "", minutes: "" });
  // theory questions
  const [theoryQuestions, setTheoryQuestions] = useState([]);
  // practical questions
  const [practicalQuestions, setPracticalQuestions] = useState([]);
  // mcq questions
  const [mcqQuestions, setMcqQuestions] = useState([]);

  const getAvailableSteps = function () {
    const steps = [1, 2];
    if (paperTypes.theory) steps.push(3);
    if (paperTypes.practical) steps.push(4);
    if (paperTypes.mcq) steps.push(5);
    return steps;
  };
  Function.prototype.getLastStep = function () {
    const steps = this();
    if (Array.isArray(steps)) {
      return steps[steps.length - 1];
    }
    return -1;
  };

  const MIN_STEP = 0;
  const MAX_STEP = getAvailableSteps().length - 1;

  const handleNext = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, MAX_STEP));
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, MIN_STEP));
  };

  const handleSubmit = async () => {
    // Submit the exam details to the server
    // navigate to the result page

    const localExamDate = moment(examDate).local();
    console.log(localExamDate.format("YYYY-MM-DD"));
    const data = {
      students: selectedStudents,
      examDate: localExamDate.format("YYYY-MM-DD"),
      course: selectedCourse?.id,
      semester: selectedSemester,
      examTime: toSeconds(examTime),
      theoryQuestions,
      practicalQuestions,
      mcqQuestions,
      paperTypes,
    };

    console.log("🚀 ~ handleSubmit ~ body:", data);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/exams`,
        data,
        {
          headers: {
            "X-Auth-Token": token,
          },
        }
      );

      // Show success message when the exam is successfully created
      toast.success("Examination created successfully!");
      console.log(response);

      setSelectedStudents([]);
      setExamDate("");
      setExamTime({ hours: "", minutes: "" });
      setTheoryQuestions([]);
      setPracticalQuestions([]);
      setMcqQuestions([]);
      setPaperTypes({ theory: true, practical: true, mcq: true });
      setCurrentStep(0);
      setSelectedCourse("");
      setSelectedSemester("");
    } catch (error) {
      // Check if the error is related to validation (e.g., 422 status code)
      if (error.response && error.response.status === 422) {
        // Assuming the server returns a detailed validation error message
        const validationErrors = error.response.data.errors;

        // Loop through each error and show it in a toast message
        for (const [field, messages] of Object.entries(validationErrors)) {
          messages.forEach((message) => {
            toast.error(`${field}: ${message}`);
          });
        }
      } else {
        // Show a generic error message if the error is not validation-related
        toast.error("An error occurred while creating the examination.");
      }
      console.log(error);
    }
  };

  const renderStep = () => {
    switch (getAvailableSteps()[currentStep]) {
      case 1:
        return (
          <FirstStep
            selectedStudents={selectedStudents}
            setSelectedStudents={setSelectedStudents}
            handleNext={handleNext}
          />
        );
      case 2:
        return (
          <SecondStep
            examDate={examDate}
            setExamDate={setExamDate}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            selectedSemester={selectedSemester}
            setSelectedSemester={setSelectedSemester}
            examTime={examTime}
            paperTypes={paperTypes}
            setPaperTypes={setPaperTypes}
            setExamTime={setExamTime}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 3:
        return (
          <TheryQuestion
            doSubmit={getAvailableSteps.getLastStep() === 3}
            handleNext={handleNext}
            handleBack={handleBack}
            theoryQuestions={theoryQuestions}
            setTheoryQuestions={setTheoryQuestions}
            handleSubmit={handleSubmit}
          />
        );
      case 4:
        return (
          <PracticalQuestion
            doSubmit={getAvailableSteps.getLastStep() === 4}
            handleNext={handleNext}
            handleBack={handleBack}
            practicalQuestions={practicalQuestions}
            setPracticalQuestions={setPracticalQuestions}
            handleSubmit={handleSubmit}
          />
        );
      case 5:
        return (
          <McqQuestion
            doSubmit={getAvailableSteps.getLastStep() === 5}
            handleNext={handleNext}
            handleBack={handleBack}
            mcqQuestions={mcqQuestions}
            setMcqQuestions={setMcqQuestions}
            handleSubmit={handleSubmit}
          />
        );
    }
  };

  return renderStep();
};
export default ManageExam;
