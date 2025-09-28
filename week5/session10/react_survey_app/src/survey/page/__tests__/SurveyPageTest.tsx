import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SurveyPageContainer from '../SurveyPageContainer';
describe('SurveyPageContainer', () => {
  test('Feedback section is hidden when no prediction has been made', () => {
    render(<SurveyPageContainer />);
    expect(document.querySelector('.feedback')).not.toBeInTheDocument();
  });

  test('Feedback section is shown after prediction is made', async () => {
    render(<SurveyPageContainer />);
    // Select a fruit first so the prediction input appears
    const fruitButton = screen.getByRole('button', { name: /apple/i });
    await act(async () => {
      await userEvent.click(fruitButton);
    });
    const input = screen.getByLabelText(/what percentage/i);
    await act(async () => {
      await userEvent.type(input, '42');
    });
    expect(document.querySelector('.feedback')).toBeInTheDocument();
  });

  test('Prediction section is hidden when page first loads', () => {
    render(<SurveyPageContainer />);
    expect(document.querySelector('.prediction')).not.toBeInTheDocument();
  });

  test('Prediction section is shown after selecting a fruit', async () => {
    render(<SurveyPageContainer />);
    // Click the first fruit button (apple)
    const fruitButton = screen.getByRole('button', { name: /apple/i });
    await act(async () => {
      await userEvent.click(fruitButton);
    });
    expect(document.querySelector('.prediction')).toBeInTheDocument();
  });
  test('Changing fruit after prediction resets prediction, updates label, and hides feedback', async () => {
    render(<SurveyPageContainer />);
    // Select "Apple" and make a prediction
    const appleButton = screen.getByRole('button', { name: /apple/i });
    await act(async () => {
      await userEvent.click(appleButton);
    });
    let input = screen.getByLabelText(/what percentage/i);
    await act(async () => {
      await userEvent.type(input, '42');
    });
    expect(document.querySelector('.feedback')).toBeInTheDocument();

    // Now select "Banana"
    const bananaButton = screen.getByRole('button', { name: /banana/i });
    await act(async () => {
      await userEvent.click(bananaButton);
    });

    // Prediction input should be reset (empty)
    input = screen.getByLabelText(/what percentage/i);
    expect(input).toHaveValue(null);

    // The label should mention Banana
    expect(screen.getByLabelText(/what percentage/i).parentElement).toHaveTextContent(/banana/i);

    // Feedback section should disappear
    expect(document.querySelector('.feedback')).not.toBeInTheDocument();
  });

  test('After changing fruit and entering new prediction, feedback appears', async () => {
    render(<SurveyPageContainer />);
    // Select "Apple" and make a prediction
    const appleButton = screen.getByRole('button', { name: /apple/i });
    await act(async () => {
      await userEvent.click(appleButton);
    });
    let input = screen.getByLabelText(/what percentage/i);
    await act(async () => {
      await userEvent.type(input, '42');
    });
    expect(document.querySelector('.feedback')).toBeInTheDocument();

    // Change to "Banana"
    const bananaButton = screen.getByRole('button', { name: /banana/i });
    await act(async () => {
      await userEvent.click(bananaButton);
    });
    input = screen.getByLabelText(/what percentage/i);
    expect(document.querySelector('.feedback')).not.toBeInTheDocument();

    // Enter a new prediction
    await act(async () => {
      await userEvent.type(input, '55');
    });
    expect(document.querySelector('.feedback')).toBeInTheDocument();
  });
});
