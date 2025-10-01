
// Hybrid SurveyPage: manages state and composes feature components
import { useState } from 'react';
import Question from '../question/Question';
import Prediction from '../prediction/Prediction';
import Feedback from '../feedback/Feedback';
import './SurveyPage.css';


function SurveyPage() {
  const [selectedFruit, setSelectedFruitState] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  // Example vote counts
  const fruitVotes: { [fruit: string]: number } = {
    Apple: 12,
    Banana: 18,
    Cherry: 7,
    Grape: 9,
    Pomegranate: 4
  };
  const fruits = Object.keys(fruitVotes);

  // When fruit changes, set the fruit state and reset prediction state
  const handleSetSelectedFruit = (fruit: string) => {
    setSelectedFruitState(fruit);
    setPrediction(null);
  };

  const handlePredictionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrediction(value === '' ? null : Number(value));
  };

  return (
    <div className="poll-container">
      <section>
        <Question
          fruits={fruits}
          fruitVotes={fruitVotes}
        />
      </section>
      <section>
        <Prediction
          selectedFruit={"Apple"}
          prediction={prediction}
          onPredictionChange={handlePredictionChange}
        />
      </section>
      {typeof prediction === 'number' ? (
        <section>
          <Feedback
            fruitVotes={fruitVotes}
            selectedFruit={"Apple"}
            prediction={prediction}
          />
        </section>
      ) : null}
    </div>
  );
}

export default SurveyPage;
