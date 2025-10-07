import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import MobileFrame from './MobileFrame';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const { preferences, updatePreferences } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPreferences, setEditedPreferences] = useState(preferences);
  const [notification, setNotification] = useState('');

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      updatePreferences(editedPreferences);
      setNotification('Preferences updated successfully!');
      setTimeout(() => setNotification(''), 3000);
    } else {
      // Start editing
      setEditedPreferences(preferences);
    }
    setIsEditing(!isEditing);
  };

  const handleDietChange = (diet) => {
    setEditedPreferences(prev => ({ ...prev, diet }));
  };

  const handleAllergyToggle = (allergy) => {
    setEditedPreferences(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const handleMealsPerDayChange = (meals) => {
    setEditedPreferences(prev => ({ ...prev, mealsPerDay: meals }));
  };

  const getDietDisplay = (diet) => {
    switch (diet) {
      case 'omni': return 'Omnivore';
      case 'vegetarian': return 'Vegetarian';
      case 'vegan': return 'Vegan';
      default: return 'Not specified';
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <MobileFrame>
      <div className="profile-content">
        <div className="profile-header">
          <div className="avatar">
            {getInitials(user?.firstName)}
          </div>
          <div className="user-info">
            <h1>{user?.firstName} {user?.lastName }</h1>
            <p className="username">@{user?.username || user?.firstName?.toLowerCase() || 'user'}</p>
          </div>
        </div>

        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}

        <div className="profile-content">
          <div className="info-section">
            <div className="section-header">
              <h2>Info</h2>
              <button 
                className={`edit-btn ${isEditing ? 'save' : 'edit'}`}
                onClick={handleEditToggle}
              >
                {isEditing ? 'Save Changes' : 'Edit my preferences'}
              </button>
            </div>

            <div className="preference-cards">
              <div className="preference-item">
                <div className="item-label">Diet</div>
                <div className="item-value">{isEditing ? (
                  <div className="diet-options">
                    {['omni', 'vegetarian', 'vegan'].map(diet => (
                      <button
                        key={diet}
                        className={`diet-btn ${editedPreferences.diet === diet ? 'active' : ''}`}
                        onClick={() => handleDietChange(diet)}
                      >
                        {getDietDisplay(diet)}
                      </button>
                    ))}
                  </div>
                ) : getDietDisplay(preferences.diet)}</div>
              </div>

              <div className="preference-item">
                <div className="item-label">Allergies</div>
                <div className="item-value">{isEditing ? (
                  <div className="allergy-options">
                    {['Gluten', 'Lactose', 'Nuts', 'Shellfish', 'Eggs'].map(allergy => (
                      <button
                        key={allergy}
                        className={`allergy-btn ${editedPreferences.allergies.includes(allergy) ? 'active' : ''}`}
                        onClick={() => handleAllergyToggle(allergy)}
                      >
                        {allergy}
                      </button>
                    ))}
                  </div>
                ) : (preferences.allergies.length > 0 ? preferences.allergies.join(', ') : '—')}</div>
              </div>

              <div className="preference-item">
                <div className="item-label">Meals/day</div>
                <div className="item-value">{isEditing ? (
                  <div className="meals-options">
                    {[1, 2, 3].map(num => (
                      <button
                        key={num}
                        className={`meals-btn ${editedPreferences.mealsPerDay === num ? 'active' : ''}`}
                        onClick={() => handleMealsPerDayChange(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                ) : preferences.mealsPerDay}</div>
              </div>
            </div>
          </div>

          <div className="logout-section">
            <button className="logout-btn" onClick={logout}>
              <span>Logout</span>
              <div className="logout-arrow">→</div>
            </button>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default Profile;
