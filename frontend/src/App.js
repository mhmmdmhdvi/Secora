import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Layout from "./Components/Layout/Layout";
import AppProviders from "./app/AppProviders";
import ProtectedRoute from "./app/ProtectedRoute";
import RouteErrorBoundary from "./app/RouteErrorBoundary";
import RouteLoading from "./app/RouteLoading";

const LandingPage = lazy(() => import("./Components/LandingPage/LandingPage"));
const LessonsPage = lazy(() => import("./Components/LessonsPage/LessonsPage"));
const LessonLoader = lazy(() => import("./Components/LessonPages/LessonLoader"));
const LearningPathsPage = lazy(() => import("./Components/LearningPaths/LearningPathsPage"));
const Login = lazy(() => import("./Components/Auth/Login"));
const SignUp = lazy(() => import("./Components/Auth/SignUp"));
const Profile = lazy(() => import("./Components/Profile/Profile"));

function App() {
  return (
    <AppProviders>
      <Layout>
        <AppRoutes />
      </Layout>
    </AppProviders>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <RouteErrorBoundary resetKey={location.pathname}>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lessons/:slug" element={<LessonLoader />} />
          <Route
            path="/paths"
            element={
              <ProtectedRoute>
                <LearningPathsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </RouteErrorBoundary>
  );
}

export default App;
