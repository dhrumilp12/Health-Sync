import React, { useState } from "react";

// Helper component to handle list of dictionaries (for medications, contacts, etc.)
const DynamicFieldArray = ({ list, setList, fields, title }) => {
  const handleAdd = () => {
    const newItem = fields.reduce((obj, field) => ({ ...obj, [field]: "" }), {});
    setList([...list, newItem]);
  };

  const handleRemove = index => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const handleChange = (index, field, value) => {
    const newList = [...list];
    newList[index][field] = value;
    setList(newList);
  };

  return (
    <div>
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">{title}</h3>
      {list.map((item, index) => (
        <div key={index} className="flex items-center space-x-3 mb-3">
          {fields.map(field => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={item[field]}
              onChange={(e) => handleChange(index, field, e.target.value)}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          ))}
          <button onClick={() => handleRemove(index)} className="py-1 px-3 bg-red-500 text-white rounded">Remove</button>
        </div>
      ))}
      <button onClick={handleAdd} className="py-1 px-3 bg-blue-500 text-white rounded">Add</button>
    </div>
  );
};

const Signup = () => {
  const [formData, setFormData] = useState({
    role: "elder", // Default to elder person
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    medicalConditions: "",
    medications: "",
    doctorContacts: "",
    emergencyContacts: "",
    sosLocation: "",
    languagePreference: "English (US)",
    notificationEnabled: true,
  });

  const requiredFields = [
    "role",
    "username",
    "email",
    "password",
    "firstName",
    "lastName",
    "dateOfBirth",
  ];
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
  ];

  const onChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
  
    const formattedData = {
      role: formData.role,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      date_of_birth: formData.dateOfBirth,
      gender: formData.gender,
      phone_number: formData.phoneNumber,
      medicalConditions:
        formData.role === "elder"
          ? formData.medicalConditions.split(",").map((item) => item.trim())
          : [],
      medications:
        formData.role === "elder"
          ? formData.medications
            ? JSON.parse(formData.medications)
            : []
          : [],
      doctorContacts:
        formData.role === "elder"
          ? formData.doctorContacts
            ? JSON.parse(formData.doctorContacts)
            : []
          : [],
      emergencyContacts:
        formData.role === "elder"
          ? formData.emergencyContacts
            ? JSON.parse(formData.emergencyContacts)
            : []
          : [],
      sosLocation: formData.sosLocation,
      languagePreference: formData.languagePreference,
      notificationEnabled: formData.notificationEnabled,
    };

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("accessToken", data.access_token);
        alert(
          "Registration successful! Check the console for more information."
        );
        console.log(data);
      } else {
        throw new Error(data.msg || "Registration failed");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed. Please try again.");
    }
  };
  

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full space-y-8">
        <div className="flex justify-center mb-6">
          <svg
            className="h-12 w-12 text-blue-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
          </svg>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create a New Account
        </h2>
        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={formData.role}
              onChange={onChange}
            >
              <option value="elder">Elder Person</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>
          {Object.keys(formData).map((key) =>
            key !== "notificationEnabled" &&
            key !== "languagePreference" &&
            key !== "role" ? (
              <div key={key} className="rounded-md shadow-sm -space-y-px">
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700"
                >
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={
                    key === "email"
                      ? "email"
                      : key === "password"
                      ? "password"
                      : key === "dateOfBirth"
                      ? "date"
                      : "text"
                  }
                  id={key}
                  name={key}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={
                    key.charAt(0).toUpperCase() +
                    key.replace(/([A-Z])/g, " $1").slice(1)
                  }
                  value={formData[key]}
                  onChange={onChange}
                  required={requiredFields.includes(key)}
                />
              </div>
            ) : key === "languagePreference" ? (
              <div key={key} className="rounded-md shadow-sm -space-y-px">
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700"
                >
                  Language Preference
                </label>
                <select
                  id={key}
                  name={key}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={formData.languagePreference}
                  onChange={onChange}
                >
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            ) : null
          )}
          <div className="flex items-center">
            <input
              id="notificationEnabled"
              name="notificationEnabled"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={formData.notificationEnabled}
              onChange={onChange}
            />
            <label
              htmlFor="notificationEnabled"
              className="ml-2 block text-sm text-gray-900"
            >
              Enable Notifications
            </label>
          </div>
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