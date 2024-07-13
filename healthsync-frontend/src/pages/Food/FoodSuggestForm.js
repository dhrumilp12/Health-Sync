import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";

const FoodSuggestForm = () => {
  const [preferences, setPreferences] = useState({
    diet_type: "",
    restrictions: [],
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5000/api/suggest_meals", {})
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          console.log("Meal added successfully");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (e) => {
    e.preventDefault();
    setPreferences({
      ...preferences,
      [e.target.name]: preferences,
    });
  };
  return (
    <>
      <Header />
      <div>
        <form onSubmit={handleSubmit} method="post">
          <label htmlFor="dietType">Diet Type</label>
          <input
            type="text"
            value={preferences.diet_type}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <label htmlFor="restrictions">Restrictions</label>
          <input
            type="text"
            value={preferences.restrictions}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default FoodSuggestForm;
