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

function App() {
  const initialHealthData = [
    { date: '2024-07-01', heartRate: 72, bloodPressure: '120/80', notes: 'Feeling good.' },
    { date: '2024-07-02', heartRate: 75, bloodPressure: '122/81', notes: 'Mild headache.' },
    { date: '2024-07-03', heartRate: 70, bloodPressure: '118/79', notes: 'Went for a walk.' },
    { date: '2024-07-04', heartRate: 80, bloodPressure: '125/85', notes: 'Slight chest pain.' },
    { date: '2024-07-05', heartRate: 68, bloodPressure: '115/76', notes: 'Felt energetic.' },
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
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/dashboard/volunteer" element={<VolunteerDash />} />
        <Route path="/volunteer-req" element={<VolunteerReq />} />
        <Route path="/sos" element={<SOS />} />
        <Route path="/health-input" element={<HealthDataInput addHealthData={addHealthData} />} />
        <Route path="/health-visualization" element={<HealthDataVisualization healthData={healthData} />} />
      </Routes>
    </>
  );
}

export default App;
