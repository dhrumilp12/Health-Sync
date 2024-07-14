import React, { useState } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";

const FoodSuggestForm = () => {
  const [preferences, setPreferences] = useState({
    diet_type: "",
    restrictions: [],
  });
  const [response, setResponse] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken'); // Retrieve the stored token
    axios
      .post("http://127.0.0.1:5000/api/suggest_meals", { preferences }, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          console.log("Meal suggestion retrieved successfully");
          setResponse(res.data.response); // Store the AI response
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "restrictions") {
      setPreferences({
        ...preferences,
        [name]: value.split(","),
      });
    } else {
      setPreferences({
        ...preferences,
        [name]: value,
      });
    }
  };

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h1 style={styles.header}>Suggest a Meal Plan</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="dietType" style={styles.label}>Diet Type</label>
            <input
              type="text"
              name="diet_type"
              value={preferences.diet_type}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="restrictions" style={styles.label}>Restrictions (comma separated)</label>
            <input
              type="text"
              name="restrictions"
              value={preferences.restrictions.join(",")}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              style={styles.input}
            />
          </div>
          <button
            type="submit"
            style={styles.button}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>
        {response && (
          <div style={styles.response}>
            <h2>Suggested Meal Plan</h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  button: {
    width: '100%',
    padding: '10px 0',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  response: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export default FoodSuggestForm;
