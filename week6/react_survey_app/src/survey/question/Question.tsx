
// Hybrid component for the survey question feature (container + presentational)
import React from 'react';
import './Question.css';



interface QuestionProps {
  fruitVotes: { [fruit: string]: number };
  fruits: string[];
}


function Question({ fruitVotes, fruits }: QuestionProps) {
  const [selectedFruit, setSelectedFruit] = React.useState<string | null>(null);
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
