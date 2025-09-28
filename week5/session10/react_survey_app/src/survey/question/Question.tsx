// Presentational component for the survey question
import React from 'react';
import './Question.css';

interface QuestionProps {
  selectedFruit: string | null;
  setSelectedFruit: (fruit: string) => void;
  fruitVotes: { [fruit: string]: number };
}

const fruits = ["Apple", "Banana", "Cherry", "Grape", "Pomegranate"];

function Question({ selectedFruit, setSelectedFruit }: QuestionProps) {
  return (
    <div className="question">
      <h2>Which is your favorite fruit?</h2>
      <ul>
        {fruits.map(fruit => (
          <li key={fruit}>
            <button
              type="button"
              className={selectedFruit === fruit ? "selected" : ""}
              onClick={() => setSelectedFruit(fruit)}
            >
              {fruit}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Question;
