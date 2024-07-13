import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Landing from "./pages/Landing";
import Profile from "./components/Profile";
import ChangePassword from "./components/ChangePassword";
import DeleteAccount from "./components/DeleteAccount";
import LogoutButton from "./components/LogoutButton";
import SOS from "./pages/SOS";
import ChatInterface from "./components/Chat_Interface";
import AppointmentForm from "./components/Appointment/AppointmentForm";
import AppointmentsList from "./components/Appointment/AppointmentsList";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/logout" element={<LogoutButton />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/schedule-appointment" element={<AppointmentForm />} />
        <Route path="/appointment-list" element={<AppointmentsList />} />
      </Routes>
    </>
  );
}

export default App;
