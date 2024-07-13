import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header/Header";

const FoodList = () => {
  const [food, setFood] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/meals")
      .then((res) => {
        const parsedFood = res.data.map((item) => JSON.parse(item));
        setFood(parsedFood);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Header />
      <div>
        {food.map((meal, index) => (
          <div key={index}>
            <p>ID: {meal._id.$oid}</p>
            <p>User ID: {meal.user.$oid}</p>
            <p>Date: {new Date(meal.date.$date).toLocaleDateString()}</p>
            <p>
              Created At: {new Date(meal.created_at.$date).toLocaleString()}
            </p>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
};

export default FoodList;
