import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Recipes from './components/Recipes';
import Planner from './components/Planner';
import Groceries from './components/Groceries';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/recipes" element={
                <ProtectedRoute>
                  <Recipes />
                </ProtectedRoute>
              } />
              <Route path="/planner" element={
                <ProtectedRoute>
                  <Planner />
                </ProtectedRoute>
              } />
              <Route path="/groceries" element={
                <ProtectedRoute>
                  <Groceries />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
            <Navbar />
          </div>
        </Router>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
