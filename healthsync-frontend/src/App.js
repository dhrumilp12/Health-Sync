import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Landing from "./pages/Landing";
import SOS from "./pages/SOS";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/sos" element={<SOS />} />
      </Routes>
    </>
  );
}

export default App;
