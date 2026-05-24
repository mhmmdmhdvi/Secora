import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./Components/Layout/Layout";
import ToastProvider from "./Components/UI/ToastProvider";

import LandingPage from "./Components/LandingPage/LandingPage";
import LessonsPage from "./Components/LessonsPage/LessonsPage";
import LessonLoader from "./Components/LessonPages/LessonLoader";
import Login from "./Components/Auth/Login";
import SignUp from "./Components/Auth/SignUp";
import ScrollToTop from "./Components/ScrollToTop";
import Profile from "./Components/Profile/Profile"

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ToastProvider />

      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lessons/:slug" element={<LessonLoader />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
