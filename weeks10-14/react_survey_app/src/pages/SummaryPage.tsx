/**
 * SummaryPage component displays a summary of the user's survey answers.
 *
 * Responsibilities:
 * - Shows each question, the user's answer, and answer counts for each option.
 *
 * Data Flow:
 * - Receives questions, answers, and answerCountsByQuestion as props from App.
 * - Maps user answers and answer counts to display summary.
 */

import React from 'react';

interface Question {
	id: number;
	text: string;
	options: { id: number; text: string }[];
}
interface Answer {
	question_id: number;
	answer_id: number | null;
	free_answer: string | null;
}
interface AnswerCount {
	answer_id: number;
	count: number;
}

export default function SummaryPage({
	questions,
	answers,
	answerCountsByQuestion
}: {
	questions: Question[];
	answers: Answer[];
	answerCountsByQuestion: Record<number, AnswerCount[]>;
}) {
	return (
		<div style={{ maxWidth: 600, margin: '2rem auto' }}>
			<h2>Survey Summary</h2>
			{questions.map(q => {
				const userAnswer = answers.find(a => a.question_id === q.id);
				const counts = answerCountsByQuestion[q.id] || [];
				console.log('--- Summary Debug ---');
				console.log('Question:', q.text);
				console.log('Options:', q.options);
				console.log('User Answer:', userAnswer);
				console.log('Counts from backend:', counts);
				return (
					<div key={q.id} style={{ marginBottom: '2em' }}>
						<h3>{q.text}</h3>
						<div>
							<strong>Your answer:</strong>{' '}
							{userAnswer?.answer_id
								? q.options.find(opt => opt.id === userAnswer.answer_id)?.text
								: userAnswer?.free_answer || <em>No answer</em>}
						</div>
						<div style={{ marginTop: 8 }}>
							<strong>Survey results:</strong>
							<ul>
								{q.options.map(opt => {
									const count = counts.find(c => c.answer_id === opt.id)?.count || 0;
									console.log('Option:', opt.text, 'Option ID:', opt.id, 'Count:', count);
									return (
										<li key={opt.id}>
											{opt.text}: {count} votes
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				);
			})}
		</div>
	);
}
