
// Hybrid SurveyPage: manages state and composes feature components
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import Question from '../question/Question';
import Prediction from '../prediction/Prediction';
import Feedback from '../feedback/Feedback';
import './SurveyPage.css';


function SurveyPage() {
  // Persist selectedFruit in localStorage
  const [selectedFruit, setSelectedFruitState] = useLocalStorage<string | null>('selectedFruit', null);
  // Persist prediction per selectedFruit in localStorage
  const [prediction, setPrediction] = useLocalStorage<number | null>(
    selectedFruit ? `prediction_${selectedFruit}` : 'prediction_',
    null
  );
  // Ephemeral input state for the prediction input box
  const [predictionInput, setPredictionInput] = useState('');

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
    setPredictionInput('');
    setPrediction(null); // clear prediction for new fruit
  };

  const handlePredictionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Always store as string, never null
    setPredictionInput(e.target.value);
  };

  const handlePredictionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only set prediction if input is a valid number
    const num = predictionInput === '' ? null : Number(predictionInput);
    if (num !== null && !isNaN(num)) {
      setPrediction(num);
    }
  };

  // Hydrate predictionInput from persisted prediction when fruit changes
  useEffect(() => {
    if (prediction !== null && prediction !== undefined) {
      setPredictionInput(String(prediction));
    } else {
      setPredictionInput('');
    }
  }, [selectedFruit]);

  return (
    <div className="poll-container">
      <section>
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
            predictionInput={predictionInput}
            onPredictionChange={handlePredictionChange}
            onPredictionSubmit={handlePredictionSubmit}
          />
        </section>
      )}
      {typeof prediction === 'number' ? (
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
