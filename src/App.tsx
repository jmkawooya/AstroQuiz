import Quiz from './components/Quiz';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './utils/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>AstroQuiz</h1>
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
