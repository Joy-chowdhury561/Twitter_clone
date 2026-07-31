import { createBrowserRouter } from "react-router-dom";
import NotificationPage from "../pages/notification/NotificationPage.jsx";
import ProfilePage from "../pages/profile/ProfilePage.jsx";
import Layout from "../pages/Layout.jsx";
import HomePage from "../pages/home/HomePage.jsx";
import LoginPage from "../pages/auth/login/LoginPage.jsx";
import SignUpPage from "../pages/auth/signup/SignUpPage.jsx";
import ProtectedRoute from "./privateRoute.jsx";
import PublicRoute from "./publicRoute.jsx";
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "/notifications", element: <NotificationPage /> },
      { path: "/profile/:username", element: <ProfilePage /> },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUpPage />
      </PublicRoute>
    ),
  },
]);
