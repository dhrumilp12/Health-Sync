import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext);

  if (!isLoggedIn) {
    console.log("User is not logged in");
    console.log("isLoggedIn value: ", isLoggedIn);

    return <Navigate to="/" replace />;

  }

  return children;
};

export default ProtectedRoute;
