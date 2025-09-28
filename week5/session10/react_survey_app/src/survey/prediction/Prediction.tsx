
// Hybrid component for the prediction feature (container + presentational)
import React from 'react';
import './Prediction.css';

interface PredictionProps {
  selectedFruit: string | null;
  prediction: number | null;
  onPredictionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Prediction({ selectedFruit, prediction, onPredictionChange }: PredictionProps) {
  const label = selectedFruit
    ? `What percentage of other respondents do you think will also choose ${selectedFruit}?`
    : 'What percentage of other respondents do you think will choose the same fruit as you?';
  return (
    <div className='prediction'>
      <h2>Prediction</h2>
      <form>
        <label htmlFor="prediction">{label}</label><br />
        <input
          type="number"
          id="prediction"
          name="prediction"
          min="0"
          max="100"
          step="1"
          value={prediction ?? ''}
          onChange={onPredictionChange}
        /> %
      </form>
    </div>
  );
}

export default Prediction;
