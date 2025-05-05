import Quiz from './components/Quiz';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './utils/ThemeContext';
import { useEffect } from 'react';
import { createStarsBackground } from './utils/StarsBackground';
import './App.css';

function App() {
  useEffect(() => {
    // Create the random starry background on component mount
    createStarsBackground();
    
    // Cleanup on unmount
    return () => {
      const container = document.querySelector('.stars-container');
      if (container) {
        document.body.removeChild(container);
      }
    };
  }, []);

  return (
    <ThemeProvider>
      <ThemeToggle />
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1><a href={import.meta.env.BASE_URL} className="title-link">✨ AstroQuiz ✨</a></h1>
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
