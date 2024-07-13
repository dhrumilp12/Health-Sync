import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Logo from "../assets/Images/Logo.png";

const Login = () => {
  const [formData, setFormData] = useState({
    login: "",  // 'login' to match with backend expecting 'login' as a key
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('accessToken', data.access_token);  // Save the token
        setIsLoggedIn(true);
        navigate("/");
        
      } else {
        throw new Error(data.msg || 'Login failed');
    }
      console.log("Access Token:", data.access_token);
      // alert('Login successful! Check the console for the access token.');
      // Redirect user or store the token depending on your application setup
    } catch (err) {
      console.error('Login error:', err.message);
      setErrorMessage(err.message || 'Something went wrong!');
    }
  };

  return (
    <>
      
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 lg:mt-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="HealthSync Logo"
          src={Logo}
          className="mx-auto h-10 w-auto rounded-md" 
        />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login" className="block text-sm font-medium leading-6 text-gray-900">
                Email address or Username
              </label>
              <div className="mt-2">
                <input
                  id="login"
                  name="login"
                  type="text"  // Can input either username or email
                  required
                  autoComplete="username"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <Link to="/change-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link to="/register">
              <span className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Sign up here
              </span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
