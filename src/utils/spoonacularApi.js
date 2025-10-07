import axios from 'axios';

// API key is now loaded from environment variables (.env file)
// This is more secure than hardcoding the key in the source code
const API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;

// Dev-only visibility: confirm whether a key is present without exposing it
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.info(
    `[Spoonacular] API key ${API_KEY ? 'detected' : 'missing (using mock data)'}`
  );
}
const BASE_URL = 'https://api.spoonacular.com/recipes';

// For demo purposes, we'll use mock data when API key is not available
const MOCK_RECIPES = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop",
    readyInMinutes: 20,
    servings: 4,
    extendedIngredients: [
      { id: 1, name: "spaghetti", amount: 400, unit: "g" },
      { id: 2, name: "eggs", amount: 3, unit: "pieces" },
      { id: 3, name: "parmesan cheese", amount: 100, unit: "g" },
      { id: 4, name: "bacon", amount: 150, unit: "g" }
    ],
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false
  },
  {
    id: 2,
    title: "Vegetarian Buddha Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop",
    readyInMinutes: 30,
    servings: 2,
    extendedIngredients: [
      { id: 5, name: "quinoa", amount: 200, unit: "g" },
      { id: 6, name: "chickpeas", amount: 1, unit: "can" },
      { id: 7, name: "avocado", amount: 1, unit: "piece" },
      { id: 8, name: "spinach", amount: 100, unit: "g" }
    ],
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true
  },
  {
    id: 3,
    title: "Chicken Teriyaki",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
    readyInMinutes: 25,
    servings: 3,
    extendedIngredients: [
      { id: 9, name: "chicken breast", amount: 500, unit: "g" },
      { id: 10, name: "soy sauce", amount: 3, unit: "tbsp" },
      { id: 11, name: "rice", amount: 200, unit: "g" },
      { id: 12, name: "broccoli", amount: 300, unit: "g" }
    ],
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: true
  },
  {
    id: 4,
    title: "Vegan Lentil Curry",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop",
    readyInMinutes: 35,
    servings: 4,
    extendedIngredients: [
      { id: 13, name: "red lentils", amount: 250, unit: "g" },
      { id: 14, name: "coconut milk", amount: 400, unit: "ml" },
      { id: 15, name: "curry powder", amount: 2, unit: "tsp" },
      { id: 16, name: "onion", amount: 1, unit: "piece" }
    ],
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true
  }
];

export const searchRecipes = async (query = '', filters = {}) => {
  // If no API key is provided, return mock data
  if (!API_KEY || API_KEY === 'YOUR_SPOONACULAR_API_KEY') {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredRecipes = [...MOCK_RECIPES];
        
        if (query) {
          filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.title.toLowerCase().includes(query.toLowerCase())
          );
        }
        
        if (filters.diet) {
          if (filters.diet === 'vegetarian') {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.vegetarian);
          } else if (filters.diet === 'vegan') {
            filteredRecipes = filteredRecipes.filter(recipe => recipe.vegan);
          }
        }
        
        if (filters.maxReadyTime) {
          filteredRecipes = filteredRecipes.filter(recipe => 
            recipe.readyInMinutes <= filters.maxReadyTime
          );
        }
        
        resolve({ results: filteredRecipes });
      }, 500);
    });
  }

  try {
    const params = {
      apiKey: API_KEY,
      query,
      number: 12,
      addRecipeInformation: true,
      fillIngredients: true,
      ...filters
    };

    const response = await axios.get(`${BASE_URL}/complexSearch`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    // Fallback to mock data on error
    return { results: MOCK_RECIPES };
  }
};

export const getRecipeDetails = async (id) => {
  // If no API key is provided, return mock data
  if (!API_KEY || API_KEY === 'YOUR_SPOONACULAR_API_KEY') {
    const recipe = MOCK_RECIPES.find(r => r.id === parseInt(id));
    return recipe || MOCK_RECIPES[0];
  }

  try {
    const response = await axios.get(`${BASE_URL}/${id}/information`, {
      params: {
        apiKey: API_KEY,
        includeNutrition: false
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return MOCK_RECIPES[0];
  }
};
