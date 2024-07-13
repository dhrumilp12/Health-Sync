import { useState } from "react";
import FilterFood from "./FilterFood";

const FoodCategories = () => {
  const [categories, setCategories] = useState("");
  const [searched, setSearched] = useState(false);

  console.log(categories.meals);
  const search = async () => {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categories}`;
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        console.log(res);
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setSearched(true);
        console.log(data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  };

  return (
    <div>
      <input
        type="text"
        onChange={(e) => setCategories(e.target.value)}
        id="default-search"
        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search for Category"
        required
      />
      <button
        onClick={search}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Search
      </button>
      <div>{searched && <FilterFood items={categories.meals} />}</div>
      <div className="grid md:grid-cols-4 grid-cols-1 m-4">
        {categories.meals &&
          categories.meals.map((item) => {
            return (
              <div
                key={item.idMeal}
                className="p-4"
                // style={{ visibility: filtered ? "hidden" : "visible" }}
              >
                <img src={item.strMealThumb} alt={item.strMeal} />
                <h1 className="font-bold text-center">{item.strMeal}</h1>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default FoodCategories;
