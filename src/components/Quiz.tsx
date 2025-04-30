import { useState, useEffect } from 'react';
import { generateQuiz, QuizQuestion, QuizMode } from '../utils/quizGenerator';
import QuizCard from './QuizCard';
import ModeSelector from './ModeSelector';
import CategorySelector, { QuizCategory } from './CategorySelector';

// Interface to track user answers
interface UserAnswer {
  question: QuizQuestion;
  userAnswer: string;
  isCorrect: boolean;
}

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [mode, setMode] = useState<QuizMode>('easy');
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<QuizCategory[]>(['planet', 'sign', 'house', 'aspect']);

  // Generate quiz questions when mode changes or when starting a new quiz
  const generateQuizQuestions = () => {
    setLoading(true);
    const quizQuestions = generateQuiz(10, mode, selectedCategories);
    setQuestions(quizQuestions);
    setLoading(false);
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setUserAnswers([]);
    setIsQuizComplete(false);
  };

  // Initial quiz generation
  useEffect(() => {
    if (quizStarted) {
      generateQuizQuestions();
    } else {
      setLoading(false);
    }
  }, [quizStarted]);

  const handleAnswer = (isCorrect: boolean, selectedOption: string) => {
    // Track the user's answer
    const currentQuestion = questions[currentQuestionIndex];
    const answer: UserAnswer = {
      question: currentQuestion,
      userAnswer: selectedOption,
      isCorrect: isCorrect
    };
    
    setUserAnswers(prev => [...prev, answer]);
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Wait 1.5 seconds before moving to the next question to allow time to see feedback
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        setIsQuizComplete(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    generateQuizQuestions();
  };

  const handleModeChange = (newMode: QuizMode) => {
    if (newMode !== mode) {
      setMode(newMode);
    }
  };

  const handleCategoriesChange = (categories: QuizCategory[]) => {
    setSelectedCategories(categories);
  };

  if (loading && quizStarted) {
    return <div className="loading">Loading quiz questions...</div>;
  }

  if (!quizStarted) {
    return (
      <div className="quiz-start">
        <div className="quiz-options">
          <div className="quiz-option-section">
            <h3>Difficulty</h3>
            <div className="mode-descriptions">
              <div className="mode-description-card">
                <h3>Easy Mode</h3>
                <p>Questions about general astrological concepts with complete descriptions.</p>
              </div>
              <div className="mode-description-card">
                <h3>Hard Mode</h3>
                <p>More challenging questions about specific keywords and individual concepts.</p>
              </div>
            </div>
            
            <div className="selector-container">
              <ModeSelector mode={mode} onModeChange={handleModeChange} />
            </div>
          </div>
          
          <div className="quiz-option-section">
            <h3>Categories</h3>
            <p>Select which astrological elements you want to be tested on:</p>
            
            <div className="selector-container">
              <CategorySelector 
                selectedCategories={selectedCategories} 
                onCategoriesChange={handleCategoriesChange} 
              />
            </div>
          </div>
        </div>
        
        <button 
          className="start-button" 
          onClick={() => setQuizStarted(true)}
        >
          Start Quiz
        </button>
      </div>
    );
  }

  if (isQuizComplete) {
    return (
      <div className="quiz-complete">
        <h2>Quiz Complete!</h2>
        <p className="final-score">Your final score: {score} out of {questions.length}</p>
        <p className="score-message">
          {score === questions.length 
            ? "Perfect score! You're an astrology expert! ✨" 
            : score >= questions.length / 2 
              ? "Great job! You know your astrology quite well." 
              : "Keep studying, you'll get there! The stars are complex."}
        </p>
        <div className="quiz-info-badges">
          <div className="info-badge mode-badge">Mode: {mode === 'easy' ? 'Easy' : 'Hard'}</div>
          <div className="info-badge categories-badge">
            Categories: {selectedCategories.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
          </div>
        </div>
        
        <div className="answers-summary">
          <h3>Your Answers</h3>
          <div className="answers-list">
            {userAnswers.map((answer, index) => (
              <div key={index} className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                <p className="question-text">
                  <span className="question-number">{index + 1}.</span> {answer.question.question}
                </p>
                <div className="answer-details">
                  <p>
                    <strong>Your answer:</strong> {answer.userAnswer}
                    <span className="answer-status">
                      {answer.isCorrect ? ' ✓' : ' ✗'}
                    </span>
                  </p>
                  {!answer.isCorrect && (
                    <p className="correct-answer">
                      <strong>Correct answer:</strong> {answer.question.correctAnswer}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="end-actions">
          <div className="quiz-config-container">
            <ModeSelector mode={mode} onModeChange={handleModeChange} />
            <CategorySelector 
              selectedCategories={selectedCategories} 
              onCategoriesChange={handleCategoriesChange} 
            />
          </div>
          
          <button className="restart-button" onClick={restartQuiz}>
            Take Quiz Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="progress">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="info">
          <div className="mode-badge">{mode === 'easy' ? 'Easy' : 'Hard'}</div>
          <div className="score">
            Score: {score}
          </div>
        </div>
      </div>
      
      {questions.length > 0 && (
        <QuizCard 
          question={questions[currentQuestionIndex]} 
          onAnswer={handleAnswer} 
        />
      )}
    </div>
  );
};

export default Quiz; 