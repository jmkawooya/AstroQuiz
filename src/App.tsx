import Quiz from './components/Quiz';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './utils/ThemeContext';
import { useEffect } from 'react';
import { createStarsBackground } from './utils/StarsBackground';
import './App.css';

function App() {
  useEffect(() => {
    // Clear any existing background styling that might be causing the overlay
    document.documentElement.style.backgroundImage = 'none';
    document.body.style.backgroundImage = 'none';
    
    // Ensure pseudo-elements are disabled (for mobile browsers)
    document.documentElement.classList.add('no-pseudo');
    document.body.classList.add('no-pseudo');
    
    // Create the random starry background on component mount
    createStarsBackground();
    
    // Cleanup on unmount
    return () => {
      const container = document.querySelector('.stars-container');
      if (container) {
        document.body.removeChild(container);
      }
      
      // Remove the classes
      document.documentElement.classList.remove('no-pseudo');
      document.body.classList.remove('no-pseudo');
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1><a href={import.meta.env.BASE_URL} className="title-link">✨ AstroQuiz ✨</a></h1>
            <ThemeToggle />
          </div>
          <p>Test your knowledge of astrological concepts!</p>
        </header>
        <main className="app-main">
          <Quiz />
        </main>
        <footer className="app-footer">
          <p>Based on <a href="https://www.honeycomb.co/resources/" target="_blank" rel="noopener noreferrer">Honeycomb Collective Study Resources</a></p>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;
