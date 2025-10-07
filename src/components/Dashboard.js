import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import MobileFrame from './MobileFrame';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mealPlan, groceryList } = useUser();

  const getPlannedDaysCount = () => {
    const today = new Date();
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      if (mealPlan[dateStr] && Object.keys(mealPlan[dateStr]).length > 0) {
        count++;
      }
    }
    return count;
  };

  const getGroceryItemsCount = () => {
    return groceryList.length;
  };

  const getGroceryPreview = () => {
    if (groceryList.length === 0) return 'No items yet';
    const items = groceryList.slice(0, 2).map(item => typeof item === 'string' ? item : item.name || item.ingredient);
    return items.join(', ') + (groceryList.length > 2 ? '...' : '');
  };

  return (
    <MobileFrame>
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="user-greeting">
            <h1>Hello {user?.firstName}</h1>
            <p>Today {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
        </div>

        <div className="main-card" onClick={() => navigate('/planner')}>
          <div className="card-content">
            <h2>Weekly challenge</h2>
            <p>Plan your meals for the week</p>
            <div className="challenge-visual">
              <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="week-calendar">
          <div className="calendar-days">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
              const date = new Date();
              date.setDate(date.getDate() - date.getDay() + index);
              const isToday = date.toDateString() === new Date().toDateString();
              const dayNum = date.getDate();
              
              return (
                <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                  <span className="day-name">{day}</span>
                  <span className="day-number">{dayNum}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="action-cards">
          <div className="action-card planner-card" onClick={() => navigate('/planner')}>
            <div className="card-header">
              <h3>My Planner</h3>
              <span className="card-badge">{getPlannedDaysCount()}/7 days</span>
            </div>
            <p>{getPlannedDaysCount()} days planned this week</p>
          </div>

          <div className="action-card grocery-card" onClick={() => navigate('/groceries')}>
            <div className="card-header">
              <h3>Grocery List</h3>
              <span className="card-badge">{getGroceryItemsCount()} items</span>
            </div>
            <p>{getGroceryPreview()}</p>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default Dashboard;
