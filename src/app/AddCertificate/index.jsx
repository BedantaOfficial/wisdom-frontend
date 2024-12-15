import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken } from "../../helpers/token";
import { CircularProgress, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

function getRandomColor() {
  const r = Math.floor(200 + Math.random() * 55); // Red value between 200-255
  const g = Math.floor(200 + Math.random() * 55); // Green value between 200-255
  const b = Math.floor(200 + Math.random() * 55); // Blue value between 200-255
  return `rgb(${r}, ${g}, ${b})`;
}

function StudenList() {
  const token = getAuthToken();
  if (!token) {
    window.location.href = import.meta.env.VITE_MAIN_URL;
  }

  const [loading, setLoading] = useState(false);
  const [userColors, setUserColors] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

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
      console.log(response);
      if (response.status === 200) {
        setUsers(response.data?.students || []);
        const colors = response.data?.students?.map(() => getRandomColor());
        setUserColors(colors);
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

  const filteredUsers = () =>
    users.filter((user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        background: "#fff",
        height: "100vh",
      }}
    >
      <IconButton
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          backgroundColor: "#1976d2",
          color: "#ffffff",
        }}
      >
        <ArrowBack />
      </IconButton>
      <h2
        style={{
          textAlign: "center",
          color: "#6a11cb",
          fontSize: "24px",
          fontWeight: "bold",
          marginTop: 50,
        }}
      >
        WISDOM COMPUTER CENTRE
      </h2>
      <h3 style={{ textAlign: "center", color: "#0000FF" }}>Smart Class</h3>
      <div
        style={{
          maxWidth: "min(90vw, 800px)",
          margin: "0 auto",
        }}
      >
        <input
          type="text"
          className="text-black"
          placeholder="Search here"
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div
        style={{
          maxWidth: "min(90vw, 800px)",
          margin: "0 auto",
          minHeight: "500px",
          maxHeight: "75vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          filteredUsers().map((user, index) => (
            <div
              key={user.id}
              onClick={() => navigate(`/addCertificate/${user.id}`)}
              style={{
                backgroundColor: userColors[index],
                padding: "10px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                color: "black",
                fontSize: "18px",
                width: "100%",
              }}
            >
              <div>
                <img
                  src={`${import.meta.env.VITE_FILE_URL}/${user.filename}`}
                  alt={user.name}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                />
                <span
                  style={{
                    marginLeft: 10,
                  }}
                >
                  {user.name}
                </span>
              </div>
              <div>
                <span style={{ fontSize: 12 }}>Payment</span>
                <br />
                <small
                  style={{
                    fontSize: 12,
                    textTransform: "uppercase",
                    color: user.late_fee === "success" ? "green" : "red",
                  }}
                >
                  {user.late_fee}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudenList;
