import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import MobileFrame from './MobileFrame';
import './Planner.css';

const Planner = () => {
  const navigate = useNavigate();
  const { mealPlan, addMealToPlan, removeMealFromPlan, preferences } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');

  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    return weekDates;
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const getDateDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getMealTypes = () => {
    const mealTypes = [];
    if (preferences.mealsPerDay >= 1) mealTypes.push('breakfast');
    if (preferences.mealsPerDay >= 2) mealTypes.push('lunch');
    if (preferences.mealsPerDay >= 3) mealTypes.push('dinner');
    return mealTypes;
  };

  const getMealIcon = (mealType) => {
    switch (mealType) {
      case 'breakfast': return 'breakfast';
      case 'lunch': return 'lunch';
      case 'dinner': return 'dinner';
      default: return 'meal';
    }
  };

  const getMealTime = (mealType) => {
    switch (mealType) {
      case 'breakfast': return '8:00 AM';
      case 'lunch': return '12:00 PM';
      case 'dinner': return '7:00 PM';
      default: return '';
    }
  };

  const handleAddMeal = (date, mealType) => {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setShowAddMeal(true);
  };

  const handleRemoveMeal = (date, mealType) => {
    removeMealFromPlan(date, mealType);
  };

  const weekDates = getWeekDates();
  const mealTypes = getMealTypes();

  return (
    <MobileFrame>
      <div className="planner-content">
        <div className="planner-header">
          <h1>Meal Plan</h1>
        </div>

        <div className="week-days-header">
          {weekDates.map((date, index) => {
            const dayName = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][index];
            const dayNum = new Date(date).getDate();
            const isSelected = date === selectedDate;
            
            return (
              <div 
                key={date} 
                className={`week-day ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className="day-name">{dayName}</span>
                <span className="day-number">{dayNum}</span>
              </div>
            );
          })}
        </div>

        <div className="current-day-view">
          <div className="day-title">
            <h2>{getDayName(selectedDate)}, {getDateDisplay(selectedDate)}</h2>
          </div>

          <div className="meals-list">
            {mealTypes.map(mealType => (
              <div key={mealType} className="meal-item">
                <div className="meal-type-header">
                  <h3>{mealType.toUpperCase()}</h3>
                </div>
                
                {mealPlan[selectedDate] && mealPlan[selectedDate][mealType] ? (
                  <div className="planned-meal-card">
                    <img 
                      src={mealPlan[selectedDate][mealType].image} 
                      alt={mealPlan[selectedDate][mealType].title}
                      className="meal-image"
                    />
                    <div className="meal-info">
                      <h4>{mealPlan[selectedDate][mealType].title}</h4>
                      <p>{mealPlan[selectedDate][mealType].servings} serving</p>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveMeal(selectedDate, mealType)}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="empty-meal-slot">
                    <p>No meal planned</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default Planner;
