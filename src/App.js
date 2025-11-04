import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/header';
import Hero from './components/hero';
import About from './components/about';
import Work from './components/work';
import Contact from './components/contact';
import Footer from './components/footer';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
   
    const authStatus = localStorage.getItem('adminAuthenticated');
    setIsAuthenticated(!!authStatus);
  }, []);

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/admin" />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? 
                <Navigate to="/admin/dashboard" /> : 
                <AdminLogin onLogin={setIsAuthenticated} />
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <>
                <Header />
                <Hero />
                <About />
                <Work />
                <Contact />
                <Footer />
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;