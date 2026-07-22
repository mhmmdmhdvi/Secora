import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ScrollToTop from "../Components/ScrollToTop";
import ToastProvider from "../Components/UI/ToastProvider";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";

function AppProviders({ children }) {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ScrollToTop />
          <ToastProvider />
          {children}
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default AppProviders;
