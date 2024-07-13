import { useState } from "react";
import ItemsData from "./Items";

const FilterFood = ({ items }) => {
  const [filteredItems, setFilteredItems] = useState(items);

  const filterItems = () => {
    const filtered = items.filter((item) => {
      let matchFound = false;

      for (let i = 0; i < ItemsData.length; i++) {
        const string = item.strMeal;
        const substring = ItemsData[i].name;
        if (string.includes(substring)) {
          console.log(string);
          matchFound = true;
          break;
        }
      }
      return matchFound;
    });
    console.log("Filtered array: ", filtered);
    setFilteredItems(filtered);
  };

  return (
    <div>
      <div className="flex justify-center">
        {ItemsData.map((item) => (
          <div key={item.id} className="flex items-center m-3">
            <input
              type="checkbox"
              id={`checkbox-${item.id}`}
              // checked={optionSelected}
            />
            <label htmlFor={`checkbox-${item.id}`}>
              <p>{item.name}</p>
            </label>
          </div>
        ))}
      </div>

      <button onClick={filterItems}>Filter</button>
      <div className="grid md:grid-cols-4 grid-cols-1 m-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="p-4">
            <img src={item.strMealThumb} alt={item.strMeal} />
            <h1 className="font-bold text-center">{item.strMeal}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterFood;
