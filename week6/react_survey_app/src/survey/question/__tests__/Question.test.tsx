import { render, screen } from '@testing-library/react';
import SurveyPage from '../../page/SurveyPage';

describe('Question component', () => {
    it('should have a white background on the whole question area', () => {
        render(<SurveyPage />);
        const questionDiv = screen.getByTestId('question');
        expect(questionDiv).toHaveClass('question');
    });
});
