import { Route, Routes } from "react-router-dom";
import "./App.css";
import ChangePassword from "./components/ChangePassword";
import DeleteAccount from "./components/DeleteAccount";
import Login from "./components/Login";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import VolunteerDash from "./components/VolunteerDash";
import VolunteerReq from "./components/VolunteerReq";
import Landing from "./pages/Landing";
import SOS from "./pages/SOS";
import HealthDataInput from "./HealthDataInput";
import HealthDataVisualization from "./components/HealthDataVisualization";
import { useState } from "react";
import ChatInterface from "./components/Chat_Interface";
import AppointmentForm from "./components/Appointment/AppointmentForm";
import AppointmentsList from "./components/Appointment/AppointmentsList";
import ProtectedRoute from "./components/ProtectedRoute";
import MedicationList from "./components/Medication/MedicationList";
import MedicationSchedule from "./components/Medication/MedicationSchedule";
import FoodCategories from "./pages/Food/Food";
import FoodForm from "./pages/Food/FoodForm";
import FoodSuggestForm from "./pages/Food/FoodSuggestForm";
import FoodList from "./pages/Food/FoodList";

function App() {
  const initialHealthData = [
    {
      date: "2024-07-01",
      heartRate: 72,
      bloodPressure: "120/80",
      notes: "Feeling good.",
    },
    {
      date: "2024-07-02",
      heartRate: 75,
      bloodPressure: "122/81",
      notes: "Mild headache.",
    },
    {
      date: "2024-07-03",
      heartRate: 70,
      bloodPressure: "118/79",
      notes: "Went for a walk.",
    },
    {
      date: "2024-07-04",
      heartRate: 80,
      bloodPressure: "125/85",
      notes: "Slight chest pain.",
    },
    {
      date: "2024-07-05",
      heartRate: 68,
      bloodPressure: "115/76",
      notes: "Felt energetic.",
    },
  ];
  const [healthData, setHealthData] = useState(initialHealthData);

  const addHealthData = (data) => {
    setHealthData([...healthData, data]);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/logout" element={<LogoutButton />} />
        <Route
          path="/delete-account"
          element={
            <ProtectedRoute>
              <DeleteAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/dashboard/volunteer" element={<VolunteerDash />} />
        <Route
          path="/volunteer-req"
          element={
            <ProtectedRoute>
              <VolunteerReq />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sos"
          element={
            <ProtectedRoute>
              <SOS />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-input"
          element={
            <ProtectedRoute>
              <HealthDataInput addHealthData={addHealthData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-visualization"
          element={
            <ProtectedRoute>
              <HealthDataVisualization healthData={healthData} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatInterface />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule-appointment"
          element={
            <ProtectedRoute>
              <AppointmentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointment-list"
          element={
            <ProtectedRoute>
              <AppointmentsList />
            </ProtectedRoute>
          }
        />
        <Route path="/medication-list" element={<MedicationList />} />
        <Route path="/medication-form" element={<MedicationSchedule />} />
        <Route path="/food" element={<FoodCategories />} />
        <Route path="/meals" element={<FoodForm />} />
        <Route path="/suggest-meals" element={<FoodSuggestForm />} />
        <Route path="/food-list" element={<FoodList />} />
      </Routes>
    </>
  );
}

export default App;
