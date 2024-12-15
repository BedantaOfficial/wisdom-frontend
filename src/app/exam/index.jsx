import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    dateOfAdmission: "",
    email: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      const data = {
        examDate: new Date().toISOString().split("T")[0], // Ensures the date is in `YYYY-MM-DD` format
        name: formData.name,
        email: formData.email,
        dateOfAdmission: formData.dateOfAdmission,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/examlogin`,
        data
      );

      if (response.status === 200) {
        setStatus({
          loading: false,
          success: "Login successful! Examination details fetched.",
          error: null,
        });
        localStorage.setItem("examId", response?.data?.examination?.id);
        localStorage.setItem("studentId", response?.data?.student?.id);

        navigate("/exam/start", {
          state: {
            examination: response?.data?.examination,
            student: response?.data?.student,
          },
        });
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 422 && data.errors) {
          // Extract validation errors into a readable format
          const formattedErrors = Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("\n");
          setStatus({
            loading: false,
            success: null,
            error: `Validation failed:\n${formattedErrors}`,
          });
        } else {
          setStatus({
            loading: false,
            success: null,
            error:
              data.message ||
              "An error occurred while processing your request.",
          });
        }
      } else {
        setStatus({
          loading: false,
          success: null,
          error: "Unable to connect to the server. Please try again later.",
        });
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Login Form</h2>

        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-600 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Date of Admission Input */}
        <div className="mb-4">
          <label htmlFor="dateOfAdmission" className="block text-gray-600 mb-2">
            Date of Admission
          </label>
          <input
            type="date"
            id="dateOfAdmission"
            name="dateOfAdmission"
            value={formData.dateOfAdmission}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status.loading}
          className={`w-full py-2 px-4 rounded transition ${
            status.loading
              ? "bg-blue-300"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {status.loading ? "Submitting..." : "Submit"}
        </button>

        {/* Display Success or Error Messages */}
        {status.success && (
          <div className="mt-4 text-green-600 font-medium">
            {status.success}
          </div>
        )}
        {status.error && (
          <div className="mt-4 text-red-600 font-medium whitespace-pre-wrap">
            {status.error}
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
