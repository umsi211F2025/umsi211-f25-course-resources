// Container for the feedback feature
import React from 'react';
import Feedback from './Feedback';
import './Feedback.css';


interface FeedbackContainerProps {
  fruitVotes: { [fruit: string]: number };
  selectedFruit: string | null;
  prediction: number;
}

function FeedbackContainer({ fruitVotes, selectedFruit, prediction }: FeedbackContainerProps) {
  return <Feedback fruitVotes={fruitVotes} selectedFruit={selectedFruit} prediction={prediction} />;
}

export default FeedbackContainer;
