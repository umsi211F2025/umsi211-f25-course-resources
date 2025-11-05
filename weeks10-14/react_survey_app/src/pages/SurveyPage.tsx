

import { useState, useEffect } from 'react';
import Question from '../survey/question/Question';
import Prediction from '../survey/prediction/Prediction';
import Feedback from '../survey/feedback/Feedback';
import './SurveyPage.css';

interface Option {
  id: number;
  text: string;
}
interface QuestionType {
  id: number;
  text: string;
  options: Option[];
}
interface AnswerCount {
  answer_id: number;
  count: number;
}


interface Answer {
  question_id: number;
  answer_id: number | null;
  free_answer: string | null;
}

interface SurveyPageProps {
  question: QuestionType;
  userAnswer?: Answer | undefined;
  onAnswer: (questionId: number, answerId: number | null, freeAnswer: string | null) => void;
  answerCounts: AnswerCount[];
}


function SurveyPage({ question, userAnswer, onAnswer, answerCounts }: SurveyPageProps) {
  // LocalStorage keys
  const fruitKey = `survey_selectedFruit_q${question.id}`;
  const predictionKey = `survey_prediction_q${question.id}`;
  const feedbackKey = `survey_feedback_q${question.id}`;

  // Reset state when question changes
  useEffect(() => {
    setSelectedFruitState(localStorage.getItem(fruitKey) || (userAnswer ? answerIdToFruit(userAnswer.answer_id) : null));
    setPrediction(() => {
      const stored = localStorage.getItem(predictionKey);
      if (stored !== null) return Number(stored);
      return userAnswer && userAnswer.free_answer ? Number(userAnswer.free_answer) : null;
    });
    // Use feedback map instead of individual feedback key
    const map = getFeedbackMap();
    setShowFeedback(!!map[question.id] || !!(userAnswer && userAnswer.free_answer !== null));
  }, [question.id]);

  // Map answer_id to fruit text for initial state
  const answerIdToFruit = (answerId: number | null | undefined): string | null => {
    if (answerId == null) return null;
    const opt = question.options.find((o) => o.id === answerId);
    return opt ? opt.text : null;
  };

  // Load initial state from localStorage or userAnswer
  const [selectedFruit, setSelectedFruitState] = useState<string | null>(() => {
    return localStorage.getItem(fruitKey) || (userAnswer ? answerIdToFruit(userAnswer.answer_id) : null);
  });
  const [prediction, setPrediction] = useState<number | null>(() => {
    const stored = localStorage.getItem(predictionKey);
    if (stored !== null) return Number(stored);
    return userAnswer && userAnswer.free_answer ? Number(userAnswer.free_answer) : null;
  });

  // Persistent feedback state for all questions
  const FEEDBACK_MAP_KEY = 'survey_feedback_map';
  function getFeedbackMap(): Record<string, boolean> {
    try {
      return JSON.parse(localStorage.getItem(FEEDBACK_MAP_KEY) || '{}');
    } catch {
      return {};
    }
  }
  function setFeedbackMap(map: Record<string, boolean>) {
    localStorage.setItem(FEEDBACK_MAP_KEY, JSON.stringify(map));
  }

  // Only show feedback after submit, restored from feedback map or if user has a prediction  
  const [showFeedback, setShowFeedback] = useState<boolean>(() => {
    const map = getFeedbackMap();
    // Show feedback if it was previously shown OR if user has a stored prediction for this question
    return !!map[question.id] || !!(userAnswer && userAnswer.free_answer !== null);
  });

  // Persist state to localStorage
  useEffect(() => {
    if (selectedFruit) {
      localStorage.setItem(fruitKey, selectedFruit);
    } else {
      localStorage.removeItem(fruitKey);
    }
  }, [selectedFruit, fruitKey]);

  // Only persist prediction on submit, not on every change



  // Persist feedback state for this question in the feedback map
  useEffect(() => {
    const map = getFeedbackMap();
    if (showFeedback) {
      map[question.id] = true;
    } else {
      delete map[question.id];
    }
    setFeedbackMap(map);
  }, [showFeedback, question.id]);

  // Map answerCounts to fruitVotes using question.options
  const fruitVotes: { [fruit: string]: number } = {};
  question.options.forEach((opt) => {
    const count = answerCounts.find((c) => c.answer_id === opt.id)?.count ?? 0;
    fruitVotes[opt.text] = count;
  });
  const fruits = question.options.map((opt) => opt.text);

  // When fruit changes, set the fruit state and reset prediction state
  const handleSetSelectedFruit = (fruit: string) => {
    setSelectedFruitState(fruit);
    setPrediction(null);
    setShowFeedback(false);
    localStorage.removeItem(predictionKey); // Clear prediction on fruit change
    // Optionally call onAnswer here if needed
    const opt = question.options.find((o) => o.text === fruit);
    if (opt) {
      onAnswer(question.id, opt.id, null);
    }
  };

  const handlePredictionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrediction(value === '' ? null : Number(value));
    setShowFeedback(false);
  };

  // Optionally handle prediction submit
  const handlePredictionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFruit && typeof prediction === 'number') {
      const opt = question.options.find((o) => o.text === selectedFruit);
      if (opt) {
        onAnswer(question.id, opt.id, String(prediction));
        localStorage.setItem(predictionKey, String(prediction)); // Only persist on submit
        setShowFeedback(true);
        // Immediately persist feedback state to ensure it survives page reloads
        const map = getFeedbackMap();
        map[question.id] = true;
        setFeedbackMap(map);
      }
    }
  };

  return (
    <div className="poll-container">
      <section>
        <h2>{question.text}</h2>
        <Question
          fruits={fruits}
          selectedFruit={selectedFruit}
          setSelectedFruit={handleSetSelectedFruit}
          fruitVotes={fruitVotes}
        />
      </section>
      {selectedFruit && (
        <section>
          <Prediction
            selectedFruit={selectedFruit}
            predictionInput={prediction === null ? '' : String(prediction)}
            onPredictionChange={handlePredictionChange}
            onPredictionSubmit={handlePredictionSubmit}
          />
        </section>
      )}
      {showFeedback && typeof prediction === 'number' ? (
        <section>
          <Feedback
            fruitVotes={fruitVotes}
            selectedFruit={selectedFruit}
            prediction={prediction}
          />
        </section>
      ) : null}
    </div>
  );
}

export default SurveyPage;
