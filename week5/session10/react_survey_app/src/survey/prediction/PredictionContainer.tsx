// Container for the prediction feature
import React from 'react';
import Prediction from './Prediction';
import './Prediction.css';

interface PredictionContainerProps {
  selectedFruit: string | null;
  prediction: number | null;
  onPredictionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function PredictionContainer({ selectedFruit, prediction, onPredictionChange }: PredictionContainerProps) {
  return <Prediction selectedFruit={selectedFruit} prediction={prediction} onPredictionChange={onPredictionChange} />;
}

export default PredictionContainer;
