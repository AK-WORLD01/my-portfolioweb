import { createContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/About';
import Education from './components/Education';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

export const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Router>
        <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
          <Navbar />
          <div className="pt-16">
            <Routes>
              {/* Main page route with all sections */}
              <Route
                path="/"
                element={
                  <>
                    <About />
                    <Education />
                    <Skills />
                    <Projects />
                    <Contact />
                  </>
                }
              />
              {/* Skills page route */}
              <Route path="/skills" element={<Skills />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;