import { useState, useEffect, useRef } from 'react';
import { QuizQuestion } from '../utils/quizGenerator';
import { scrollElementToCenter } from '../utils/scrollHelper';

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean, selectedOption: string) => void;
  showNextButton?: boolean;
  onNextQuestion?: () => void;
  isLastQuestion?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ 
  question, 
  onAnswer, 
  showNextButton = false,
  onNextQuestion,
  isLastQuestion = false
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Reset component state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
  }, [question.id]);

  const handleOptionClick = (option: string) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(option);
    setHasAnswered(true);
    
    const isCorrect = option === question.correctAnswer;
    onAnswer(isCorrect, option);
  };

  const handleNextClick = () => {
    if (onNextQuestion) {
      onNextQuestion();
    }
  };

  const getOptionClassName = (option: string) => {
    if (!hasAnswered || selectedAnswer !== option) {
      return 'option';
    }
    
    if (option === question.correctAnswer) {
      return 'option correct';
    }
    
    return 'option incorrect';
  };

  return (
    <div className="quiz-card">
      <div className="question-container">
        <h3 className="question">{question.question}</h3>
        <div className="category-badge">{question.category}</div>
      </div>
      
      <div className="options-container">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={getOptionClassName(option)}
            onClick={() => handleOptionClick(option)}
            disabled={hasAnswered}
          >
            {option}
          </button>
        ))}
      </div>
      
      <div className="feedback-container" ref={feedbackRef}>
        {hasAnswered && (
          <div className="feedback">
            {selectedAnswer === question.correctAnswer ? (
              <p className="correct-message">✓ Correct!</p>
            ) : (
              <div className="incorrect-feedback">
                <p className="incorrect-message">✗ Incorrect</p>
                <p className="correct-answer">
                  The correct answer is: <strong>{question.correctAnswer}</strong>
                </p>
              </div>
            )}
          </div>
        )}
        
        {showNextButton && (
          <button 
            className="next-button" 
            onClick={handleNextClick}
          >
            {!isLastQuestion ? '→' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizCard; 