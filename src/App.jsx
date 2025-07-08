import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./views/AuthPage";
import './App.css';
import './ProfileCard.css';
import CreateStylistProfile from "./views/CreateStylistProfile";
import Reserve from "./views/Reserve";
import ViewAppointments from "./views/ViewAppointments";
import LoginPage from "./views/LoginPage";
import Dashboard from "./views/Dashboard";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/CreateStylistProfile" element={<CreateStylistProfile />} />
          <Route path="/Reserve/:id" element={<Reserve />} />
          <Route path="/ViewAppointments/:id" element={<ViewAppointments />} />
          <Route path="/LoginPage" element={<LoginPage />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
        </Routes>
      </Router>
      </div>
  );
}

export default App;
