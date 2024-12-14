import React, { useEffect, useState } from "react";
import {
  TextField,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { getAuthToken } from "../../helpers/token";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const FirstStep = ({ selectedStudents, setSelectedStudents, handleNext }) => {
  const token = getAuthToken();
  if (!token) {
    window.location.href = import.meta.env.VITE_MAIN_URL;
  }

  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/students`,
        {
          headers: {
            "X-Auth-Token": `${token}`,
          },
        }
      );
      if (response.status === 200) {
        setUsers(response.data?.students || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId]
    );
  };

  const handleAddnewExam = () => {
    if (selectedStudents.length === 0) {
      return alert("Atleast one student needs to be selected");
    }
    handleNext();
  };

  const renderStudents = () => {
    if (loading) {
      return (
        <div className="w-full h-full flex justify-center items-center">
          <CircularProgress />
        </div>
      );
    }
    return (
      <List className="space-y-2">
        {filteredUsers.map((student) => (
          <ListItem
            key={student.id}
            className="flex justify-between items-center bg-white rounded-lg shadow-sm p-2 hover:bg-gray-200 transition-all"
          >
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={selectedStudents.includes(student.id)}
                onChange={() => handleCheckboxChange(student.id)}
                className="text-blue-500"
              />
              <img
                src={`${import.meta.env.VITE_FILE_URL}/${student.filename}`}
                alt={student.name}
                className="w-12 h-12 rounded-full border-2 border-gray-300"
              />
              <div>
                <ListItemText
                  primary={student.name}
                  secondary={`Enroll No: ${student.enrollment_no}`}
                  primaryTypographyProps={{
                    className: "font-semibold text-gray-800",
                  }}
                  secondaryTypographyProps={{
                    className: "text-gray-600",
                  }}
                />
              </div>
            </div>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center bg-gray-100">
      <div className="w-[95%] py-2">
        <IconButton
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#1976d2",
            color: "#ffffff",
          }}
        >
          <ArrowBack />
        </IconButton>
      </div>
      <div className="max-w-[500px] w-[95%] bg-gray-300 rounded-lg shadow-lg h-[95%] overflow-hidden">
        {/* Fixed Search Field */}
        <div className="sticky top-0 bg-gray-300 z-10 px-4 py-2">
          <TextField
            label="Search Students"
            variant="outlined"
            fullWidth
            value={searchText}
            onChange={handleSearch}
          />
        </div>
        {/* Scrollable List */}
        <div className="h-[calc(100%-4rem)] overflow-y-auto px-4 pb-4">
          {renderStudents()}
        </div>
      </div>

      {/* Buttons */}
      <div className="max-w-[500px] w-[95%] h-[10%] flex items-center justify-between  py-2">
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
          onClick={() => navigate("/enrolledStudents")}
        >
          Enrolled Students
        </Button>
        <Button
          sx={{
            backgroundColor: "#3b82f6",
            color: "white",
            "&:hover": {
              backgroundColor: "#2563eb",
            },
          }}
          variant="contained"
          onClick={handleAddnewExam}
        >
          Add New Exam
        </Button>
      </div>
    </div>
  );
};

export default FirstStep;
