import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { DashboardPage } from "./pages/Dashboard";
import { LandingPage } from "./pages/Landing";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { TripDetailsPage } from "./pages/TripDetails";
import { JoinTripPage } from "./pages/JoinTrip";

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/join-trip/:token"
          element={
            <ProtectedRoute>
              <JoinTripPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trip/:id"
          element={
            <ProtectedRoute>
              <TripDetailsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
