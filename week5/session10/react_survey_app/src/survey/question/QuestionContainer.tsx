import React from 'react';
import Question from './Question';
import './Question.css';

// Container for the survey question feature


interface QuestionContainerProps {
  selectedFruit: string | null;
  setSelectedFruit: (fruit: string) => void;
  fruitVotes: { [fruit: string]: number };
}

function QuestionContainer({ selectedFruit, setSelectedFruit, fruitVotes }: QuestionContainerProps) {
  return <Question selectedFruit={selectedFruit} setSelectedFruit={setSelectedFruit} fruitVotes={fruitVotes} />;
}

export default QuestionContainer;
