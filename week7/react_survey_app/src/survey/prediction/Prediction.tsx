
// Hybrid component for the prediction feature (container + presentational)
import type { ChangeEvent } from 'react';
import './Prediction.css';

interface PredictionProps {
  selectedFruit: string | null;
  predictionInput: string;
  onPredictionChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPredictionSubmit: (e: React.FormEvent) => void;
}

function Prediction({ selectedFruit, predictionInput, onPredictionChange, onPredictionSubmit }: PredictionProps) {
  const label = selectedFruit
    ? `What percentage of other respondents do you think will also choose ${selectedFruit}?`
    : 'What percentage of other respondents do you think will choose the same fruit as you?';
  return (
    <div className='prediction'>
      <h2>Prediction</h2>
      <form onSubmit={onPredictionSubmit}>
        <label htmlFor="prediction">{label}</label><br />
        <input
          type="number"
          id="prediction"
          name="prediction"
          min="0"
          max="100"
          step="1"
          value={predictionInput}
          onChange={onPredictionChange}
        /> %
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Prediction;
