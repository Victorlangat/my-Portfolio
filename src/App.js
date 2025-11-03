import React from 'react';
import './App.css';
import Header from './components/header';
import Hero from './components/hero';
import About from './components/about';
import Work from './components/work';
import Contact from './components/contact';
import Footer from './components/footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <About />
      <Work />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;