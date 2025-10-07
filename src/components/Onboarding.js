import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MobileFrame from './MobileFrame';
import './Onboarding.css';
import { ReactComponent as StarIcon } from '../assets/star-svgrepo-com.svg';
import { ReactComponent as HeartIcon } from '../assets/heart-svgrepo-com.svg';
import { ReactComponent as CupcakeIcon } from '../assets/cupcake-svgrepo-com.svg';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    diet: 'omni',
    allergies: [],
    mealsPerDay: 2
  });
  const [customAllergy, setCustomAllergy] = useState('');

  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleDietChange = (diet) => {
    setPreferences(prev => ({ ...prev, diet }));
  };

  const handleAllergyToggle = (allergy) => {
    setPreferences(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }));
  };

  const handleMealsPerDayChange = (meals) => {
    setPreferences(prev => ({ ...prev, mealsPerDay: meals }));
  };

  const handleSavePreferences = () => {
    // Store preferences temporarily
    localStorage.setItem('yumgo_temp_preferences', JSON.stringify(preferences));
    navigate('/register');
  };

  return (
    <MobileFrame>
      <div className="onboarding-content">
        <div className="onboarding-hero">
          <div className="hero-decor" aria-hidden>
            <div className="decor-icon decor-coral" style={{ top: -18, left: -6, transform: 'rotate(-10deg)' }}>
              <StarIcon width={96} height={96} />
            </div>
            <div className="decor-icon decor-tiffany" style={{ bottom: -12, left: -10, transform: 'rotate(12deg)' }}>
              <CupcakeIcon width={120} height={120} />
            </div>
            <div className="decor-icon decor-periwinkle" style={{ top: -20, right: -6, transform: 'rotate(18deg)' }}>
              <HeartIcon width={120} height={120} />
            </div>
          </div>
          <div className="hero-content">
            <h1 className="logo">Welcome to Yum&GO</h1>
            <p className="hero-description">
              Your personal meal planning companion that makes cooking enjoyable and grocery shopping effortless
            </p>
            <div className="hero-features">
              <div className="feature-item">
                <span>Smart meal planning</span>
              </div>
              <div className="feature-item">
                <span>Auto grocery lists</span>
              </div>
              <div className="feature-item">
                <span>Personalized recipes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="preferences-section">
          <div className="preferences-intro">
            <h2>Let's personalize your experience</h2>
            <p>Tell us about your preferences so we can suggest the perfect meals for you.</p>
          </div>
          
          <div className="preference-group">
            <h3>Choose your diet</h3>
          <div className="diet-options">
            <button
              className={`diet-btn ${preferences.diet === 'omni' ? 'active' : ''}`}
              onClick={() => handleDietChange('omni')}
            >
              OMNI
            </button>
            <button
              className={`diet-btn ${preferences.diet === 'veggie' ? 'active' : ''}`}
              onClick={() => handleDietChange('veggie')}
            >
              VEGGIE
            </button>
            <button
              className={`diet-btn ${preferences.diet === 'vegan' ? 'active' : ''}`}
              onClick={() => handleDietChange('vegan')}
            >
              VEGAN
            </button>
          </div>

          <h3>Allergies</h3>
          <div className="allergies-options">
            {['GLUTEN', 'LACTOSE', 'NUTS'].map(allergy => (
              <button
                key={allergy}
                className={`allergy-btn ${preferences.allergies.includes(allergy) ? 'active' : ''}`}
                onClick={() => handleAllergyToggle(allergy)}
              >
                {allergy}
              </button>
            ))}
            {preferences.allergies.filter(a => !['GLUTEN', 'LACTOSE', 'NUTS'].includes(a)).map(allergy => (
              <button
                key={allergy}
                className="allergy-btn active custom"
                onClick={() => handleAllergyToggle(allergy)}
              >
                {allergy} ×
              </button>
            ))}
            <button
              className="allergy-btn add-btn"
              onClick={() => {
                const newAllergy = prompt('Add custom allergy:');
                if (newAllergy) {
                  handleAllergyToggle(newAllergy.toUpperCase());
                }
              }}
            >
              + OTHER
            </button>
          </div>

          </div>
          
          <div className="preference-group">
            <h3>Meals per day</h3>
            <div className="meals-options">
            {[1, 2, 3].map(num => (
              <label key={num} className="meal-option">
                <input
                  type="radio"
                  name="mealsPerDay"
                  value={num}
                  checked={preferences.mealsPerDay === num}
                  onChange={() => handleMealsPerDayChange(num)}
                />
                <span className="meal-number">{num}</span>
              </label>
            ))}
          </div>

          <button className="save-btn" onClick={handleSavePreferences}>
            Save my preferences
          </button>

          <div className="login-link">
            Already have an account? <button onClick={() => navigate('/login')}>Sign in</button>
          </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
};

export default Onboarding;
