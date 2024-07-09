import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Landing from "./pages/Landing";
import Profile from "./components/Profile";
import ChangePassword from "./components/ChangePassword";
import DeleteAccount from "./components/DeleteAccount";
import LogoutButton from "./components/LogoutButton";
import VolunteerDash from "./components/VolunteerDash";
import VolunteerReq from "./components/VolunteerReq";
import SOS from "./pages/SOS";

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
        <Route path="/dashboard/volunteer" element={<VolunteerDash />} />
        <Route path="/volunteer-req" element={<VolunteerReq />} />
        <Route path="/sos" element={<SOS />} />
      </Routes>
    </>
  );
}

export default App;
