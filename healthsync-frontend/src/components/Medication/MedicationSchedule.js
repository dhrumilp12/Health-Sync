import React, { useState } from "react";
import axios from "axios";
import Header from "../Header/Header";

const MedicationSchedule = () => {
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [reminderTimes, setReminderTimes] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5000/api/schedule-medication", {
        medicineName,
        dosage,
        frequency,
        date,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="mx-auto w-1/2 p-4 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Schedule Medication
          </h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="medicineName"
                className="block text-sm font-medium text-gray-700"
              >
                Medicine Name
              </label>
              <input
                type="text"
                id="medicineName"
                name="medicineName"
                onChange={(e) => setMedicineName(e.target.value)}
                value={medicineName}
                placeholder="Medicine name"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="dosage"
                className="block text-sm font-medium text-gray-700"
              >
                Dosage
              </label>
              <input
                type="text"
                id="dosage"
                name="dosage"
                onChange={(e) => setDosage(e.target.value)}
                value={dosage}
                placeholder="dosage"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="frequency"
                className="block text-sm font-medium text-gray-700"
              >
                Frequency
              </label>
              <input
                id="frequency"
                type="datetime-local"
                name="frequency"
                onChange={(e) => setFrequency(e.target.value)}
                value={frequency}
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
                onChange={(e) => setDate(e.target.value)}
                value={date}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="reminderTimes"
                className="block text-sm font-medium text-gray-700"
              >
                Reminder Times
              </label>
              <input
                type="time"
                id="reminderTimes"
                name="reminderTimes"
                onChange={(e) =>
                  setReminderTimes([...reminderTimes, e.target.value])
                }
                value={reminderTimes}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="submit"
                value="Add Appointment"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={handleSubmit}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MedicationSchedule;
