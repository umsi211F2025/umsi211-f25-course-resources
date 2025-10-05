import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SurveyPage from '../SurveyPage';

beforeEach(() => {
  window.localStorage.clear();

});

describe('SurveyPage', () => {
  test('Prediction persists after submit and reload, but is cleared after changing fruit and reload', async () => {
    const { unmount } = render(<SurveyPage />);
    // Select "Grape"
    const grapeButton = screen.getByRole('button', { name: /grape/i });
    await act(async () => {
      await userEvent.click(grapeButton);
    });
    // Enter prediction 25 and submit
    const input = screen.getByLabelText(/what percentage/i);
    await act(async () => {
      await userEvent.type(input, '25');
    });
    const submit = screen.getByRole('button', { name: /submit/i });
    await act(async () => {
      await userEvent.click(submit);
    });
    // Feedback should be visible
    expect(document.querySelector('.feedback')).toBeTruthy();
    // Simulate reload by unmounting and remounting
    unmount();
    render(<SurveyPage />);
    await waitFor(() => {
      expect(document.querySelector('.feedback')).toBeTruthy();
      const inputAfter = screen.getByLabelText(/what percentage/i) as HTMLInputElement;
      expect(inputAfter.value).toBe('25');
    });

    // Now select a different fruit (Banana)
    const bananaButton = screen.getByRole('button', { name: /banana/i });
    await act(async () => {
      await userEvent.click(bananaButton);
    });
    // Simulate reload again
    unmount();
    render(<SurveyPage />);
    await waitFor(() => {
      expect(document.querySelector('.feedback')).toBeNull();
      const inputAfterBanana = screen.getByLabelText(/what percentage/i) as HTMLInputElement;
      expect(inputAfterBanana.value).toBe('');
    });
  });

  test('Selected fruit persists but prediction does not if not submitted', async () => {
    const { unmount } = render(<SurveyPage />);
    // Select "Grape"
    const grapeButton = screen.getByRole('button', { name: /grape/i });
    await act(async () => {
      await userEvent.click(grapeButton);
    });
    // Enter prediction 25 but do not submit
    const input = screen.getByLabelText(/what percentage/i);
    await act(async () => {
      await userEvent.type(input, '25');
    });
    // Simulate reload by unmounting and remounting
    unmount();
    render(<SurveyPage />);
    // Grape should still be selected
    await waitFor(() => {
      const grapeButtonAfter = screen.getByRole('button', { name: /grape/i });
      expect(grapeButtonAfter.className).toMatch(/selected/);
      // Prediction input should be empty/null
      const inputAfter = screen.getByLabelText(/what percentage/i) as HTMLInputElement;
      expect(inputAfter.value).toBe('');
    });
  });
  test('Feedback only appears after submitting prediction, not while typing', async () => {
    render(<SurveyPage />);
    // Select a fruit so prediction input appears
    const fruitButton = screen.getByRole('button', { name: /apple/i });
    await act(async () => {
      await userEvent.click(fruitButton);
    });
    const input = screen.getByLabelText(/what percentage/i);
    // Feedback should not be shown yet
    expect(document.querySelector('.feedback')).toBeNull();
    // Type a value, feedback should still not be shown
    await act(async () => {
      await userEvent.type(input, '42');
    });
    // The input should show 42
    expect((input as HTMLInputElement).value).toBe('42');
    expect(document.querySelector('.feedback')).toBeNull();
    // Click the submit button (which does not exist yet)
    // This will fail until implemented
    const submit = screen.getByRole('button', { name: /submit/i });
    await act(async () => {
      await userEvent.click(submit);
    });
    // Now feedback should be shown
    expect(document.querySelector('.feedback')).toBeTruthy();
  });

  test('Feedback section is hidden when no prediction has been made', () => {
  render(<SurveyPage />);
    expect(document.querySelector('.feedback')).toBeNull();
  });

  test('Feedback section is shown after prediction is made', async () => {
    render(<SurveyPage />);
    // Select a fruit first so the prediction input appears
    const fruitButton = screen.getByRole('button', { name: /apple/i });
    await act(async () => {
      await userEvent.click(fruitButton);
    });
    const input = screen.getByLabelText(/what percentage/i);
    await act(async () => {
      await userEvent.type(input, '42');
    });
    // Feedback should not be shown yet
    expect(document.querySelector('.feedback')).toBeNull();
    // Click submit
    const submit = screen.getByRole('button', { name: /submit/i });
    await act(async () => {
      await userEvent.click(submit);
    });
    expect(document.querySelector('.feedback')).toBeTruthy();
  });

  test('Prediction section is hidden when page first loads', () => {
  render(<SurveyPage />);
    expect(document.querySelector('.prediction')).toBeNull();
  });

  test('Prediction section is shown after selecting a fruit', async () => {
  render(<SurveyPage />);
    // Click the first fruit button (apple)
    const fruitButton = screen.getByRole('button', { name: /apple/i });
    await act(async () => {
      await userEvent.click(fruitButton);
    });
    expect(document.querySelector('.prediction')).toBeTruthy();
  });
  test('Changing fruit after prediction resets prediction, updates label, and hides feedback', async () => {
    render(<SurveyPage />);
    // Select "Apple" and make a prediction
    const appleButton = screen.getByRole('button', { name: /apple/i });
    await act(async () => {
      await userEvent.click(appleButton);
    });
    let input = screen.getByLabelText(/what percentage/i);
    await act(async () => {
      await userEvent.type(input, '42');
    });
    // Click submit
    let submit = screen.getByRole('button', { name: /submit/i });
    await act(async () => {
      await userEvent.click(submit);
    });
    expect(document.querySelector('.feedback')).toBeTruthy();

    // Now select "Banana"
    const bananaButton = screen.getByRole('button', { name: /banana/i });
    await act(async () => {
      await userEvent.click(bananaButton);
    });


  // Prediction input should be reset (empty string)
  await waitFor(() => {
    const inputEl = screen.getByLabelText(/what percentage/i) as HTMLInputElement;
    expect(inputEl.value).toBe('');
    // The label should mention Banana
    expect(screen.getByLabelText(/what percentage/i).parentElement?.textContent).toMatch(/banana/i);
    // Feedback section should disappear
    expect(document.querySelector('.feedback')).toBeNull();
  });
  });

  test('After changing fruit and entering new prediction, feedback appears', async () => {
    render(<SurveyPage />);
    // Select "Apple" and make a prediction
    const appleButton = screen.getByRole('button', { name: /apple/i });
    await act(async () => {
      await userEvent.click(appleButton);
    });
    let input = screen.getByLabelText(/what percentage/i);
    await act(async () => {
      await userEvent.type(input, '42');
    });
    // Click submit
    let submit = screen.getByRole('button', { name: /submit/i });
    await act(async () => {
      await userEvent.click(submit);
    });
    expect(document.querySelector('.feedback')).toBeTruthy();

    // Change to "Banana"
    const bananaButton = screen.getByRole('button', { name: /banana/i });
    await act(async () => {
      await userEvent.click(bananaButton);
    });
    input = screen.getByLabelText(/what percentage/i);
    expect(document.querySelector('.feedback')).toBeNull();

    // Enter a new prediction
    await act(async () => {
      await userEvent.type(input, '55');
    });
    // Click submit
    submit = screen.getByRole('button', { name: /submit/i });
    await act(async () => {
      await userEvent.click(submit);
    });
    expect(document.querySelector('.feedback')).toBeTruthy();
  });
});
