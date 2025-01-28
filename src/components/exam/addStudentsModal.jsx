import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  height: "90%",
  maxWidth: "600px",
  bgcolor: "background.paper",
  border: "1px solid #ddd",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  display: "flex",
  flexDirection: "column",
};

const AddStudentsModal = ({
  examId,
  open,
  setOpen,
  token,
  onStudentEnrolled,
}) => {
  const [unrolledStudents, setUnrolledStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUnrolledStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${window.env.VITE_BASE_URL}/api/v1/exam-students/students?examId=${examId}`,
        {
          headers: {
            "X-Auth-Token": token,
          },
        }
      );
      if (response.status === 200 && response.data?.notEnrolledStudents) {
        setUnrolledStudents(response.data.notEnrolledStudents);
        setFilteredStudents(response.data.notEnrolledStudents); // Initialize filtered list
      }
    } catch (error) {
      console.error("Error fetching unrolled students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(
      (prev) =>
        prev.includes(studentId)
          ? prev.filter((id) => id !== studentId) // Deselect if already selected
          : [...prev, studentId] // Add if not selected
    );
  };

  const handleAddStudents = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student to enroll.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${window.env.VITE_BASE_URL}/api/v1/exam-students/addStudents`,
        {
          examId,
          students: selectedStudents,
        },
        {
          headers: {
            "X-Auth-Token": token,
          },
        }
      );
      console.log(response);
      if (response.status === 201) {
        alert("Students enrolled successfully!");
        setUnrolledStudents([]);
        setSelectedStudents([]);
        setFilteredStudents([]);
        onStudentEnrolled();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error enrolling students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const lowerCasedTerm = e.target.value.toLowerCase();
    const filtered = unrolledStudents.filter(
      (student) =>
        student.name?.toLowerCase().includes(lowerCasedTerm) ||
        student.email?.toLowerCase().includes(lowerCasedTerm)
    );
    setFilteredStudents(filtered);
  };

  useEffect(() => {
    if (open) {
      fetchUnrolledStudents();
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-title"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
          Add Students to Exam
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mb: 2 }}
        />
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            my={4}
          >
            <CircularProgress />
          </Box>
        ) : filteredStudents.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center">
            No unrolled students found.
          </Typography>
        ) : (
          <List sx={{ flexGrow: 1, overflowY: "auto", mb: 8 }}>
            {filteredStudents.map((student) => (
              <ListItem
                key={student.id}
                sx={{ borderBottom: "1px solid #eee", py: 1, color: "black" }}
              >
                <ListItemText
                  primary={student.name || "Unknown"}
                  secondary={student.email}
                />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
        <Box
          position="fixed"
          bottom={16}
          sx={{
            display: "flex",
            gap: 10,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddStudents}
            disabled={loading || selectedStudents.length === 0}
          >
            Add Selected
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddStudentsModal;
