import React, { useState } from 'react';
import SurveyPage from './SurveyPage';


function SurveyPageContainer() {
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

  // When fruit changes, reset prediction
const handleSetSelectedFruit = (fruit: string) => {
  setSelectedFruitState(fruit);
  setPrediction(null);
};

  const handlePredictionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrediction(value === '' ? null : Number(value));
  };

  return (
    <SurveyPage
      selectedFruit={selectedFruit}
      setSelectedFruit={handleSetSelectedFruit}
      fruitVotes={fruitVotes}
      prediction={prediction}
      onPredictionChange={handlePredictionChange}
    />
  );
}

export default SurveyPageContainer;
