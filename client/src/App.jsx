import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Navigate,
  Link,
} from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));
  return (
    <Routes>
      <Route
        path="/"
        element={
          !token ? (
            <Register setToken={setToken} />
          ) : (
            <Navigate to="/dashboard"></Navigate>

            // navigate("/dashboard")
            // <Link to="/dashboard" />
          )
        }
      />
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route
        path="/dashboard"
        element={
          token ? (
            <Dashboard token={token} setToken={setToken} />
          ) : (
            <Navigate to="/login"></Navigate>
            // <Link to="/login" />
            // navigate("/login")
          )
        }
      />
    </Routes>
  );
}

export default App;
