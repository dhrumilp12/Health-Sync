import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";

const FoodList = () => {
  const [food, setFood] = useState([]);
  const [error, setError] = useState('');
  const [editMealId, setEditMealId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/meals", {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      const parsedMeals = response.data.meals.map(meal => JSON.parse(meal));
      setFood(parsedMeals);
    } catch (err) {
      console.error("Error fetching meals:", err);
      setError('Failed to load meals. Please try again later.');
    }
  };

  const handleEdit = (meal) => {
    setEditMealId(meal._id.$oid);
    const firstMeal = meal.meals[0];
    setEditFormData({
      name: firstMeal.name,
      calories: firstMeal.calories,
      protein: firstMeal.protein,
      carbs: firstMeal.carbs,
      fats: firstMeal.fats
    });
  };

  const handleDelete = async (mealId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/meals/${mealId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      fetchMeals(); // Refresh the list after deletion
    } catch (err) {
      console.error("Error deleting meal:", err);
    }
  };

  const handleInputChange = (field, value) => {
    const newData = { ...editFormData, [field]: parseFloat(value) };
    if (field === 'protein' || field === 'carbs' || field === 'fats') {
      newData.calories = (newData.protein * 4) + (newData.carbs * 4) + (newData.fats * 9);
    }
    setEditFormData(newData);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const updateData = {
      date: new Date().toISOString(),  // Ensure date is in the correct format
      meals: [{
        name: editFormData.name,
        calories: parseFloat(editFormData.calories),
        protein: parseFloat(editFormData.protein),
        carbs: parseFloat(editFormData.carbs),
        fats: parseFloat(editFormData.fats)
      }]
    };
  
    try {
      await axios.put(`http://127.0.0.1:5000/api/meals/${editMealId}`, updateData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setEditMealId(null);
      fetchMeals();  // Refresh the list after update
    } catch (err) {
      console.error("Error updating meal:", err);
    }
  };
  

  return (
    <>
    <Header />
    <div style={styles.container}>
      <h1 style={styles.header}>My Meals</h1>
      {food.length > 0 ? (
        food.map((meal) => (
          <div key={meal._id.$oid} style={styles.mealCard}>
            {editMealId === meal._id.$oid ? (
              <form onSubmit={handleUpdate} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name</label>
                  <input type="text" value={editFormData.name} onChange={(e) => handleInputChange('name', e.target.value)} style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Calories</label>
                  <input type="number" value={editFormData.calories.toFixed(2)} readOnly style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Protein (g)</label>
                  <input type="number" value={editFormData.protein} onChange={(e) => handleInputChange('protein', e.target.value)} style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Carbs (g)</label>
                  <input type="number" value={editFormData.carbs} onChange={(e) => handleInputChange('carbs', e.target.value)} style={styles.input} />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Fats (g)</label>
                  <input type="number" value={editFormData.fats} onChange={(e) => handleInputChange('fats', e.target.value)} style={styles.input} />
                </div>
                <div style={styles.buttonGroup}>
                  <button type="submit" style={styles.button}>Save</button>
                  <button onClick={() => setEditMealId(null)} style={styles.button}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <p style={styles.text}><strong>ID:</strong> {meal._id.$oid}</p>
                <p style={styles.text}><strong>User ID:</strong> {meal.user.$oid}</p>
                <p style={styles.text}><strong>Date:</strong> {new Date(meal.date.$date).toLocaleDateString()}</p>
                <p style={styles.text}><strong>Created At:</strong> {new Date(meal.created_at.$date).toLocaleString()}</p>
                {meal.meals.map((subMeal, index) => (
                  <div key={index} style={styles.subMeal}>
                    <p style={styles.text}><strong>Name:</strong> {subMeal.name}</p>
                    <p style={styles.text}><strong>Calories:</strong> {subMeal.calories.toFixed(2)}</p>
                    <p style={styles.text}><strong>Protein (g):</strong> {subMeal.protein.toFixed(2)}</p>
                    <p style={styles.text}><strong>Carbs (g):</strong> {subMeal.carbs.toFixed(2)}</p>
                    <p style={styles.text}><strong>Fats (g):</strong> {subMeal.fats.toFixed(2)}</p>
                  </div>
                ))}
                <div style={styles.buttonGroup}>
                  <button onClick={() => handleEdit(meal)} style={styles.button}>Edit</button>
                  <button onClick={() => handleDelete(meal._id.$oid)} style={styles.button}>Delete</button>
                </div>
              </>
            )}
            <hr />
          </div>
        ))
      ) : (
        <p style={styles.text}>No meals found. Start adding some!</p>
      )}
    </div>

      
    </>

  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  mealCard: {
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '10px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '8px',
    fontSize: '14px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  text: {
    margin: '5px 0',
    color: '#555',
  },
  subMeal: {
    paddingLeft: '15px',
    borderLeft: '3px solid #eee',
    marginBottom: '10px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: '10px 15px',
    fontSize: '14px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    marginRight: '5px',
  }
};

export default FoodList;
