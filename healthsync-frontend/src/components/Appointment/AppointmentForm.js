import React, { useState } from "react";
import axios from "axios";

const AppointmentForm = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [doctorName, setDoctorName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5000/api/schedule-appointment", {
        name,
        date,
        doctorName,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="mx-auto w-1/2 p-4 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Schedule an appointment
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="doctor"
              className="block text-sm font-medium text-gray-700"
            >
              Doctor Name
            </label>
            <input
              type="text"
              id="doctorName"
              name="doctorName"
              placeholder="Doctor's name"
              onChange={(e) => setDoctorName(e.target.value)}
              value={doctorName}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              id="date"
              type="datetime-local"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <input
              type="submit"
              value="Add Appointment"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
