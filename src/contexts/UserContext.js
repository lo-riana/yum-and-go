import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    diet: 'omni', // omni, vegetarian, vegan
    allergies: [],
    mealsPerDay: 3
  });
  const [mealPlan, setMealPlan] = useState({});
  const [groceryList, setGroceryList] = useState([]);

  useEffect(() => {
    if (user) {
      // Load user preferences from localStorage
      const storedPrefs = localStorage.getItem(`yumgo_preferences_${user.id}`);
      if (storedPrefs) {
        setPreferences(JSON.parse(storedPrefs));
      }

      // Load meal plan
      const storedMealPlan = localStorage.getItem(`yumgo_mealplan_${user.id}`);
      if (storedMealPlan) {
        setMealPlan(JSON.parse(storedMealPlan));
      }

      // Load grocery list
      const storedGroceries = localStorage.getItem(`yumgo_groceries_${user.id}`);
      if (storedGroceries) {
        setGroceryList(JSON.parse(storedGroceries));
      }
    }
  }, [user]);

  const updatePreferences = (newPrefs) => {
    const updatedPrefs = { ...preferences, ...newPrefs };
    setPreferences(updatedPrefs);
    if (user) {
      localStorage.setItem(`yumgo_preferences_${user.id}`, JSON.stringify(updatedPrefs));
    }
  };

  const addMealToPlan = (date, mealType, recipe) => {
    const updatedPlan = {
      ...mealPlan,
      [date]: {
        ...mealPlan[date],
        [mealType]: recipe
      }
    };
    setMealPlan(updatedPlan);
    if (user) {
      localStorage.setItem(`yumgo_mealplan_${user.id}`, JSON.stringify(updatedPlan));
    }
    
    // Auto-update grocery list
    updateGroceryListFromMealPlan(updatedPlan);
  };

  const removeMealFromPlan = (date, mealType) => {
    const updatedPlan = { ...mealPlan };
    if (updatedPlan[date]) {
      delete updatedPlan[date][mealType];
      if (Object.keys(updatedPlan[date]).length === 0) {
        delete updatedPlan[date];
      }
    }
    setMealPlan(updatedPlan);
    if (user) {
      localStorage.setItem(`yumgo_mealplan_${user.id}`, JSON.stringify(updatedPlan));
    }
    
    // Auto-update grocery list
    updateGroceryListFromMealPlan(updatedPlan);
  };

  const updateGroceryListFromMealPlan = (plan) => {
    const ingredients = new Map();
    
    Object.values(plan).forEach(dayMeals => {
      Object.values(dayMeals).forEach(recipe => {
        if (recipe && recipe.extendedIngredients) {
          recipe.extendedIngredients.forEach(ingredient => {
            const key = ingredient.name.toLowerCase();
            if (ingredients.has(key)) {
              const existing = ingredients.get(key);
              ingredients.set(key, {
                ...existing,
                amount: existing.amount + ingredient.amount
              });
            } else {
              ingredients.set(key, {
                id: ingredient.id,
                name: ingredient.name,
                amount: ingredient.amount,
                unit: ingredient.unit,
                checked: false
              });
            }
          });
        }
      });
    });

    const newGroceryList = Array.from(ingredients.values());
    setGroceryList(newGroceryList);
    if (user) {
      localStorage.setItem(`yumgo_groceries_${user.id}`, JSON.stringify(newGroceryList));
    }
  };

  const toggleGroceryItem = (itemId) => {
    const updatedList = groceryList.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    setGroceryList(updatedList);
    if (user) {
      localStorage.setItem(`yumgo_groceries_${user.id}`, JSON.stringify(updatedList));
    }
  };

  const checkAllGroceries = () => {
    const updatedList = groceryList.map(item => ({ ...item, checked: true }));
    setGroceryList(updatedList);
    if (user) {
      localStorage.setItem(`yumgo_groceries_${user.id}`, JSON.stringify(updatedList));
    }
  };

  const value = {
    preferences,
    updatePreferences,
    mealPlan,
    addMealToPlan,
    removeMealFromPlan,
    groceryList,
    toggleGroceryItem,
    checkAllGroceries
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
