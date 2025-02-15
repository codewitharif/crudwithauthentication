import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

function Dashboard({ token, setToken }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/getData", {
          headers: { Authorization: token },
        })
        .then((res) => setData(res.data))
        .catch(() => {
          setToken(null);
          navigate("/login");
        });
    }
  }, [token]);

  const handleAddData = async () => {
    await axios.post("http://localhost:5000/addData", { token, name, phone });
    setName("");
    setPhone("");
    const res = await axios.get("http://localhost:5000/getData", {
      headers: { Authorization: token },
    });
    setData(res.data);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone"
      />
      <button onClick={handleAddData}>Add</button>
      <ul>
        {data.map((item) => (
          <li key={item._id}>
            {item.name} - {item.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
