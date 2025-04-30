import { QuizMode } from '../utils/quizGenerator';

interface ModeSelectorProps {
  mode: QuizMode;
  onModeChange: (mode: QuizMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onModeChange }) => {
  return (
    <div className="mode-selector">
      <div className="mode-label">Difficulty:</div>
      
      <div className="mode-options">
        <button 
          className={`mode-button ${mode === 'easy' ? 'active' : ''}`}
          onClick={() => onModeChange('easy')}
          aria-pressed={mode === 'easy'}
        >
          Easy
        </button>
        
        <button 
          className={`mode-button ${mode === 'hard' ? 'active' : ''}`}
          onClick={() => onModeChange('hard')}
          aria-pressed={mode === 'hard'}
        >
          Hard
        </button>
      </div>
    </div>
  );
};

export default ModeSelector; 