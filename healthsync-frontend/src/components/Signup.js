import React, { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    medicalConditions: "",  // Initialize as empty strings instead of arrays
    medications: "",
    doctorContacts: "",
    emergencyContacts: "",
    sosLocation: "",
    languagePreference: "English (US)", // Set default language preference
    notificationEnabled: true,
  });
  const requiredFields = ['username', 'email', 'password', 'firstName', 'lastName', 'dateOfBirth'];
  const languages = [
    "English (US)",
    "Español (Spain)",
    "Deutsch (Germany)",
    "Français (France)",
    "中文 (Simplified)",
    "日本語 (Japan)",
    "Русский (Russia)",
    "हिन्दी (India)",
    "Português (Brazil)",
  ]; // List of languages
  const onChange = e => {
    const { id, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formattedData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,  // Change to match backend
      last_name: formData.lastName,    // Change to match backend
      date_of_birth: formData.dateOfBirth, // This is correct now
      gender: formData.gender,
      phone_number: formData.phoneNumber, // Assuming backend expects phone_number
      medicalConditions: formData.medicalConditions.split(",").map(item => item.trim()),
      medications: formData.medications ? JSON.parse(formData.medications) : [],
        doctorContacts: formData.doctorContacts ? JSON.parse(formData.doctorContacts) : [],
        emergencyContacts: formData.emergencyContacts ? JSON.parse(formData.emergencyContacts) : [],
      sosLocation: formData.sosLocation,
      languagePreference: formData.languagePreference,
      notificationEnabled: formData.notificationEnabled,
  };

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });
      console.log("Formatted Data to send:", formattedData);
      const data = await response.json();
      if (response.ok) {
        // Store the access token in local storage
        localStorage.setItem('accessToken', data.access_token);
        alert('Registration successful! Check the console for more information.');
        console.log(data);
        // Optionally redirect the user or perform further actions
      } else {
        throw new Error(data.msg || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration failed:', err); // Handle errors here
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full space-y-8">
        <div className="flex justify-center mb-6">
          <svg className="h-12 w-12 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
          </svg>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create a New Account</h2>
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          {Object.keys(formData).map((key) => (
            key !== 'notificationEnabled' && key !== 'languagePreference' ? (
              <div key={key} className="rounded-md shadow-sm -space-y-px">
                <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                type={key === 'email' ? 'email' : key === 'password' ? 'password' : key === 'dateOfBirth' ? 'date' : 'text'}
                id={key}
                name={key}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={key.charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').slice(1)}
                value={formData[key]}
                onChange={onChange}
                required={requiredFields.includes(key)}
              />
            </div>
            ) : key === 'languagePreference' ? (
              <div key={key} className="rounded-md shadow-sm -space-y-px">
                <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                  Language Preference
                </label>
                <select
                  id={key}
                  name={key}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={formData.languagePreference}
                  onChange={onChange}
                >
                  {languages.map(language => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            ): (
              <div key={key} className="flex items-center">
                <input
                  id={key}
                  name={key}
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={formData[key]}
                  onChange={onChange}
                />
                <label htmlFor={key} className="ml-2 block text-sm text-gray-900">
                  Enable Notifications
                </label>
              </div>
            )
          ))}
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
