// SurveyPage: Composes the three main feature containers
import React, { useState } from 'react';

import QuestionContainer from '../question/QuestionContainer';
import PredictionContainer from '../prediction/PredictionContainer';
import FeedbackContainer from '../feedback/FeedbackContainer';
import './SurveyPage.css';


interface SurveyPageProps {
  selectedFruit: string | null;
  setSelectedFruit: (fruit: string) => void;
  fruitVotes: { [fruit: string]: number };
  prediction: number | null;
  onPredictionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function SurveyPage({ selectedFruit, setSelectedFruit, fruitVotes, prediction, onPredictionChange }: SurveyPageProps) {
  return (
    <div className="poll-container">
      <section>
        <QuestionContainer
          selectedFruit={selectedFruit}
          setSelectedFruit={setSelectedFruit}
          fruitVotes={fruitVotes}
        />
      </section>
      {selectedFruit && (
        <section>
          <PredictionContainer
            selectedFruit={selectedFruit}
            prediction={prediction}
            onPredictionChange={onPredictionChange}
          />
        </section>
      )}
      {typeof prediction === 'number' ? (
        <section>
          <FeedbackContainer
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
