import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import MobileFrame from './MobileFrame';
import './Recipes.css';
import { searchRecipes } from '../utils/spoonacularApi';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    maxReadyTime: '',
    diet: ''
  });
  const { preferences, addMealToPlan } = useUser();
  const [notification, setNotification] = useState('');
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');

  useEffect(() => {
    loadRecipes();
    // Set default date to today
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  const loadRecipes = async (query = '', filterOptions = {}) => {
    setLoading(true);
    try {
      // Préparer les filtres pour l'API
      const apiFilters = {};
      if (filterOptions.maxReadyTime) {
        apiFilters.maxReadyTime = Number(filterOptions.maxReadyTime);
      }
      if (filterOptions.diet) {
        apiFilters.diet = filterOptions.diet; // 'vegetarian' | 'vegan'
      }

      const { results } = await searchRecipes(query, apiFilters);
      setRecipes(results || []);
    } catch (error) {
      console.error('Error loading recipes:', error);
      setRecipes([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadRecipes(searchQuery, filters);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    loadRecipes(searchQuery, newFilters);
  };

  const openMealModal = (recipe) => {
    setSelectedRecipe(recipe);
    setSelectedMealType('lunch'); // Default to lunch
    setShowMealModal(true);
  };

  const addRecipeToPlanner = () => {
    if (selectedRecipe && selectedDate && selectedMealType) {
      addMealToPlan(selectedDate, selectedMealType, selectedRecipe);
      
      const dayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
      setNotification(`Recipe added to ${dayName} ${selectedMealType}!`);
      setTimeout(() => setNotification(''), 3000);
      
      setShowMealModal(false);
      setSelectedRecipe(null);
    }
  };

  const getMealTypes = () => {
    const mealTypes = [];
    if (preferences.mealsPerDay >= 1) mealTypes.push({ value: 'breakfast', label: 'Breakfast' });
    if (preferences.mealsPerDay >= 2) mealTypes.push({ value: 'lunch', label: 'Lunch' });
    if (preferences.mealsPerDay >= 3) mealTypes.push({ value: 'dinner', label: 'Dinner' });
    return mealTypes;
  };

  const getWeekDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
        isToday: i === 0
      });
    }
    return dates;
  };

  const isRecipeCompatible = (recipe) => {
    if (preferences.diet === 'vegetarian' && !recipe.vegetarian) return false;
    if (preferences.diet === 'vegan' && !recipe.vegan) return false;
    
    // Check allergies 
    if (preferences.allergies.includes('Gluten') && !recipe.glutenFree) return false;
    
    return true;
  };

  return (
    <MobileFrame>
      <div className="recipes-content">
        <div className="recipes-header">
          <h1>Recipes</h1>
          <p>Find delicious meals that match your preferences</p>
        </div>

        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search for recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <div className="search-icon-btn"></div>
            </button>
          </form>

          <div className="filters">
            <select
              value={filters.maxReadyTime}
              onChange={(e) => handleFilterChange('maxReadyTime', e.target.value)}
              className="filter-select"
            >
              <option value="">Any prep time</option>
              <option value="15">Under 15 min</option>
              <option value="30">Under 30 min</option>
              <option value="60">Under 1 hour</option>
            </select>

            <select
              value={filters.diet}
              onChange={(e) => handleFilterChange('diet', e.target.value)}
              className="filter-select"
            >
              <option value="">Any diet</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading delicious recipes... </div>
        ) : (
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-image">
                  <img src={recipe.image} alt={recipe.title} />
                  {!isRecipeCompatible(recipe) && (
                    <div className="incompatible-overlay">
                      ⚠️ May not match your preferences
                    </div>
                  )}
                </div>
                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.title}</h3>
                  <div className="recipe-meta">
                    <span className="prep-time">⏱️ {recipe.readyInMinutes} min</span>
                    <span className="servings">👥 {recipe.servings} servings</span>
                  </div>
                  <div className="recipe-tags">
                    {recipe.vegetarian && <span className="tag vegetarian">Vegetarian</span>}
                    {recipe.vegan && <span className="tag vegan">Vegan</span>}
                    {recipe.glutenFree && <span className="tag gluten-free">Gluten-Free</span>}
                  </div>
                  <button
                    className="add-btn"
                    onClick={() => openMealModal(recipe)}
                  >
                    + Add to Planner
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && recipes.length === 0 && (
          <div className="no-results">
            <p>No recipes found. Try adjusting your search or filters.</p>
          </div>
        )}

        {showMealModal && selectedRecipe && (
          <div className="modal-overlay" onClick={() => setShowMealModal(false)}>
            <div className="meal-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add "{selectedRecipe.title}" to your planner</h3>
                <button className="close-btn" onClick={() => setShowMealModal(false)}>×</button>
              </div>
              
              <div className="modal-content">
                <div className="recipe-preview">
                  <img src={selectedRecipe.image} alt={selectedRecipe.title} />
                  <div className="recipe-info">
                    <p>⏱️ {selectedRecipe.readyInMinutes} min</p>
                    <p>👥 {selectedRecipe.servings} servings</p>
                  </div>
                </div>

                <div className="selection-section">
                  <div className="form-group">
                    <label>Choose a day:</label>
                    <select 
                      value={selectedDate} 
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="date-select"
                    >
                      {getWeekDates().map(date => (
                        <option key={date.value} value={date.value}>
                          {date.label} {date.isToday ? '(Today)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Choose meal time:</label>
                    <div className="meal-type-buttons">
                      {getMealTypes().map(meal => (
                        <button
                          key={meal.value}
                          className={`meal-type-btn ${selectedMealType === meal.value ? 'active' : ''}`}
                          onClick={() => setSelectedMealType(meal.value)}
                        >
                          <span>{meal.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setShowMealModal(false)}>
                    Cancel
                  </button>
                  <button 
                    className="confirm-btn" 
                    onClick={addRecipeToPlanner}
                    disabled={!selectedDate || !selectedMealType}
                  >
                    Add to Planner
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileFrame>
  );
};

export default Recipes;
