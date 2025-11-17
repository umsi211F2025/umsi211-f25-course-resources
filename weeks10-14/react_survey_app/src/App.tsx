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
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from '@clerk/clerk-react';

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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load questions and answer counts on mount
  useEffect(() => {
    setLoading(true);
    getQuestions().then((qs: Question[]) => {
      setQuestions(qs);
      setLoading(false);
    }).catch((e: Error) => {
      setError(e.message);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '2em' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', alignItems: 'center' }}>
        <h1>Survey App</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <SignedOut>
            <SignInButton mode="modal" />
            <SignUpButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <main>
        <SignedOut>
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>
            Please sign in to take the survey
          </p>
        </SignedOut>
        <SignedIn>
          <SurveyContent questions={questions} />
        </SignedIn>
      </main>
    </div>
  );
}

interface SurveyContentProps {
  questions: Question[];
}

function SurveyContent({ questions }: SurveyContentProps) {
  const { getToken } = useAuth();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answerCounts, setAnswerCounts] = useState<Record<number, AnswerCount[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user answers and answer counts when component mounts
  useEffect(() => {
    if (!questions.length) return;
    
    const loadData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setLoading(false);
          return;
        }

        // Load user's answers
        const userAnswers = await getAnswers(token);
        setAnswers(userAnswers);

        // Load answer counts for all questions
        const countPromises = questions.map((q: Question) => 
          getAnswerCounts(q.id).then((counts: AnswerCount[]) => ({ questionId: q.id, counts }))
        );
        
        const allCounts = await Promise.all(countPromises);
        const countMap: Record<number, AnswerCount[]> = {};
        allCounts.forEach(({ questionId, counts }) => {
          countMap[questionId] = counts;
        });
        setAnswerCounts(countMap);

        // Resume at first not explicitly completed question
        const completed = getCompletedQuestions();
        const idx = questions.findIndex((q: Question) => !completed.includes(q.id));
        setCurrentIdx(idx === -1 ? questions.length : idx);
        
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    loadData();
  }, [questions, getToken]);

  // Answer handler
  const handleAnswer = async (questionId: number, answerId: number | null, freeAnswer: string | null) => {
    try {
      const token = await getToken();
      if (!token) {
        setError('Not authenticated');
        return;
      }

      await addOrUpdateAnswer({
        question_id: questionId,
        answer_id: answerId ?? 0,
        free_answer: freeAnswer
      }, token);

      // Refresh answers only
      const as = await getAnswers(token);
      setAnswers(as);
    } catch (e: any) {
      setError(e.message);
    }
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

  const handleResetAll = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('survey_'))
      .forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '2em' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  if (!questions.length) return <>
    <button className="reset-button" onClick={() => {
      localStorage.removeItem(COMPLETED_KEY);
      handleResetAll();
    }}>Reset All Local State</button>
    <div>No survey questions found.</div>
  </>;

  // If all questions answered, show summary
  if (currentIdx >= questions.length) {
    return <>
      <button className="reset-button" onClick={() => {
        localStorage.removeItem(COMPLETED_KEY);
        handleResetAll();
      }}>Reset All Local State</button>
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
      <button className="reset-button" onClick={() => {
        localStorage.removeItem(COMPLETED_KEY);
        handleResetAll();
      }}>Reset All Local State</button>
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
