  // Utility: Clear all survey-related localStorage and reload
  const handleResetAll = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('survey_'))
      .forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

/**
 * Main App component for the survey application.
 *
 * Responsibilities:
 * - Handles user registration, survey flow, and summary display.
 * - Fetches questions and answers from the backend API.
 * - Manages user session in localStorage.
 * - Tracks current question, user answers, and answer counts.
 * - Composes Registration, SurveyPage, and SummaryPage components.
 *
 * Data Flow:
 * - Loads questions and answers on mount or user login.
 * - Passes questions and answer data to SurveyPage and SummaryPage.
 * - Updates answers and answer counts via API and state.
 * - Persists user info in localStorage for session continuity.
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import LoginForm from './LoginForm';
import { getQuestions, getAnswers, addOrUpdateAnswer, getAnswerCounts } from 'src/api';
import SurveyPage from 'src/pages/SurveyPage';
import SummaryPage from 'src/pages/SummaryPage';
import './App.css';

interface Question {
  id: number;
  text: string;
  options: { id: number; text: string }[];
}
interface Answer {
  question_id: number;
  answer_id: number | null;
  free_answer: string | null;
}
interface AnswerCount {
  answer_id: number;
  count: number;
}


const COMPLETED_KEY = 'survey_completed_questions';


function getCompletedQuestions(): number[] {
  try {
    return JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]');
  } catch {
    return [];
  }
}

function setCompletedQuestions(ids: number[]) {
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(ids));
}

function App() {
  // Auth comes from JWT auth context
  const { user, token, logout } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answerCounts, setAnswerCounts] = useState<Record<number, AnswerCount[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all answer counts on initial load or page reload
  useEffect(() => {
    setLoading(true);
    getQuestions().then((qs: Question[]) => {
      setQuestions(qs);
      
      // Load answer counts for all questions
      const countPromises = qs.map((q: Question) => 
        getAnswerCounts(q.id).then((counts: AnswerCount[]) => ({ questionId: q.id, counts }))
      );
      
      Promise.all(countPromises).then((allCounts) => {
        const countMap: Record<number, AnswerCount[]> = {};
        allCounts.forEach(({ questionId, counts }) => {
          countMap[questionId] = counts;
        });
        setAnswerCounts(countMap);
        setLoading(false);
      });
    }).catch((e: Error) => {
      setError(e.message);
      setLoading(false);
    });
  }, []); // Run once on mount (initial load or page reload)

  // Load user answers when user is set
  useEffect(() => {
    // Load answers only when authenticated
    if (!user || !token) return;
    getAnswers().then((as: Answer[]) => {
      setAnswers(as);
      const completed = getCompletedQuestions();
      const idx = questions.findIndex((q: Question) => !completed.includes(q.id));
      setCurrentIdx(idx === -1 ? questions.length : idx);
    }).catch((e: Error) => setError(e.message));
  }, [user, token, questions]);


  // Answer handler (uses authenticated user implicitly via JWT on backend)
  const handleAnswer = async (questionId: number, answerId: number | null, freeAnswer: string | null) => {
    if (!user || !token) return;
    await addOrUpdateAnswer({
      question_id: questionId,
      answer_id: answerId ?? 0,
      free_answer: freeAnswer
    });
    const as = await getAnswers();
    setAnswers(as);
    // Do NOT advance question here; wait for Next button
  };

  const handleNextQuestion = () => {
    if (!questions.length) return;
    // Mark current question as completed
    const completed = getCompletedQuestions();
    const qid = questions[currentIdx]?.id;
    if (qid && !completed.includes(qid)) {
      setCompletedQuestions([...completed, qid]);
    }
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCurrentIdx(questions.length); // go to summary
    }
  };

  const handlePrevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    } else if (currentIdx === questions.length) {
      // From summary page, go to last question
      setCurrentIdx(questions.length - 1);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '2em' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  // Show reset button at all times for debugging
  if (!user) return (
    <>
      <div className="top-bar">
        <button className="reset-button" onClick={() => {
          localStorage.removeItem(COMPLETED_KEY);
          handleResetAll();
        }}>Reset Local State</button>
      </div>
      <LoginForm />
    </>
  );
  if (!questions.length) return <>
    <div className="top-bar">
      <button className="reset-button" onClick={() => {
        localStorage.removeItem(COMPLETED_KEY);
        handleResetAll();
      }}>Reset Local State</button>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>{user?.email}</span>
        <button onClick={logout} className="navigation-button">Logout</button>
      </div>
    </div>
    <div>No survey questions found.</div>
  </>;

  // If all questions answered, show summary
  if (currentIdx >= questions.length) {
    return <>
      <div className="top-bar">
        <button className="reset-button" onClick={() => {
          localStorage.removeItem(COMPLETED_KEY);
          handleResetAll();
        }}>Reset Local State</button>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>{user?.email}</span>
          <button onClick={logout} className="navigation-button">Logout</button>
        </div>
      </div>
      <div className="summary-navigation">
        <div className="summary-navigation-buttons">
          <button onClick={handlePrevQuestion} className="navigation-button">
            ← Previous Question
          </button>
        </div>
        <SummaryPage questions={questions} answers={answers} answerCountsByQuestion={answerCounts} />
      </div>
    </>;
  }

  // Show current question
  const q: Question | undefined = questions[currentIdx];
  if (!q) return <div>Question not found.</div>;
  const userAnswer = answers.find((a: Answer) => a.question_id === q.id);
  const hasAnswer = !!userAnswer && (userAnswer.answer_id !== null || userAnswer.free_answer !== null);

  return (
    <>
      <div className="top-bar">
        <button className="reset-button" onClick={() => {
          localStorage.removeItem(COMPLETED_KEY);
          handleResetAll();
        }}>Reset Local State</button>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>{user?.email}</span>
          <button onClick={logout} className="navigation-button">Logout</button>
        </div>
      </div>
      <div className="navigation-container">
        <div className="navigation-buttons">
          {currentIdx > 0 ? (
            <button onClick={handlePrevQuestion} className="navigation-button">
              ← Previous Question
            </button>
          ) : <div></div>}
          {hasAnswer && (
            <button onClick={handleNextQuestion} className="navigation-button">
              {currentIdx === questions.length - 1 ? 'Finish Survey' : 'Next Question →'}
            </button>
          )}
        </div>
        <SurveyPage
          question={q}
          userAnswer={userAnswer}
          onAnswer={handleAnswer}
          answerCounts={answerCounts[q.id] || []}
        />
        {hasAnswer && (
          <div className="bottom-navigation-buttons">
            <div></div>
            <button onClick={handleNextQuestion} className="navigation-button">
              {currentIdx === questions.length - 1 ? 'Finish Survey' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
