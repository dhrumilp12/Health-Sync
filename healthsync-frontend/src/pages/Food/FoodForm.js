
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";


const FoodForm = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  // Initialize meals with calculated calories set to zero
  const [meals, setMeals] = useState([{ name: '', calories: 0, protein: '', carbs: '', fats: '' }]);

  const calculateCalories = (protein, carbs, fats) => {
    // Each gram of protein and carbs provides 4 calories, and each gram of fat provides 9 calories
    return (parseFloat(protein) * 4) + (parseFloat(carbs) * 4) + (parseFloat(fats) * 9);
  };

  const handleMealChange = (index, field, value) => {
    const newMeals = [...meals];
    newMeals[index][field] = value;

    // Automatically calculate calories whenever protein, carbs, or fats are updated
    if (['protein', 'carbs', 'fats'].includes(field)) {
      newMeals[index].calories = calculateCalories(
        newMeals[index].protein || 0,
        newMeals[index].carbs || 0,
        newMeals[index].fats || 0
      );
    }

    setMeals(newMeals);
  };

  const addMeal = () => {
    setMeals([...meals, { name: '', calories: 0, protein: '', carbs: '', fats: '' }]);
  };

  const removeMeal = index => {
    const newMeals = [...meals];
    newMeals.splice(index, 1);
    setMeals(newMeals);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isoDate = date ? new Date(date).toISOString() : new Date().toISOString();
    
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/meals', {
        date: isoDate, 
        meals
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      console.log('Meal added successfully:', response);
      navigate('/food');
    } catch (error) {
      console.error('Error posting meal:', error);
      alert(`Failed to add meal. Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <>
      <Header />
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-semibold text-center mb-6">Add Your Meals</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            Date and Time
          </label>
          <input
            type="datetime-local"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        {meals.map((meal, index) => (
          <div key={index} className="mb-4 bg-gray-100 p-3 rounded">
            <h2 className="text-lg font-bold">Meal {index + 1}</h2>
            <input type="text" placeholder="Name" value={meal.name} onChange={(e) => handleMealChange(index, 'name', e.target.value)} required className="mt-2 p-2 w-full border-gray-300 rounded-md" />
            <input type="text" readOnly value={`Calories: ${meal.calories.toFixed(0)}`} className="mt-2 p-2 w-full border-gray-300 rounded-md bg-gray-200 text-gray-600" />
            <div className="grid grid-cols-3 gap-4">
              {['protein', 'carbs', 'fats'].map((nutrient, idx) => (
                <input key={idx} type="number" placeholder={`${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} (g)`} value={meal[nutrient]} onChange={(e) => handleMealChange(index, nutrient, e.target.value)} className="mt-2 p-2 border-gray-300 rounded-md" />
              ))}
            </div>
            {meals.length > 1 && (
              <button type="button" onClick={() => removeMeal(index)} className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addMeal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Another Meal
        </button>
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded block mt-4 w-full">
          Submit
        </button>
      </form>
    </div>

    </>

  );
};

export default FoodForm;
