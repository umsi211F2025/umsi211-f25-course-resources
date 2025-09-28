// Presentational component for the feedback feature
import React from 'react';
import './Feedback.css';


interface FeedbackProps {
  fruitVotes: { [fruit: string]: number };
  selectedFruit: string | null;
  prediction: number;
}

function Feedback({ fruitVotes, selectedFruit, prediction }: FeedbackProps) {
  if (!selectedFruit) {
    return (
      <div className="feedback">
        <h2>Feedback</h2>
        <p>Please select a fruit to see feedback.</p>
      </div>
    );
  }

  const totalVotes = Object.values(fruitVotes).reduce((a, b) => a + b, 0);
  const selectedVotes = fruitVotes[selectedFruit] || 0;
  const actualPercent = totalVotes > 0 ? Math.round((selectedVotes / totalVotes) * 100) : 0;
  const predictedPercent = Math.round(prediction);

  return (
    <div className="feedback">
      <h2>Feedback</h2>
      <div style={{ margin: '24px 0' }}>
        <div style={{ marginBottom: '8px' }}>
          <span>Actual: {actualPercent}%</span>
          <div style={{ background: '#e0e0e0', height: '24px', borderRadius: '12px', overflow: 'hidden', marginTop: '4px' }}>
            <div style={{ width: `${actualPercent}%`, background: '#4f8cff', height: '100%', borderRadius: '12px' }}></div>
          </div>
        </div>
        <div>
          <span>Prediction: {predictedPercent}%</span>
          <div style={{ background: '#e0e0e0', height: '24px', borderRadius: '12px', overflow: 'hidden', marginTop: '4px' }}>
            <div style={{ width: `${predictedPercent}%`, background: '#ffb347', height: '100%', borderRadius: '12px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
