import React, { useState } from "react";
import Header from "./components/Header/Header";

const HealthDataInput = ({ addHealthData }) => {
  const [formData, setFormData] = useState({
    date: "",
    heartRate: "",
    bloodPressure: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addHealthData(formData);
    setFormData({
      date: "",
      heartRate: "",
      bloodPressure: "",
      notes: "",
    });
  };

  return (
    <>
      <Header />
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold mb-4">Submit Health Data</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Heart Rate</label>
          <input
            type="number"
            name="heartRate"
            value={formData.heartRate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Blood Pressure</label>
          <input
            type="text"
            name="bloodPressure"
            value={formData.bloodPressure}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default HealthDataInput;
