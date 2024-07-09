import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Landing from "./pages/Landing";
import Profile from "./components/Profile";
import ChangePassword from "./components/ChangePassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
