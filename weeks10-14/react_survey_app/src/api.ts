/// <reference types="vite/client" />


// API utility for frontend to call backend endpoints
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface Question {
	id: number;
	text: string;
	options: { id: number; text: string }[];
}

export interface Answer {
	question_id: number;
	answer_id: number;
	free_answer: string | null;
}

export async function getQuestions(): Promise<Question[]> {
	const res = await fetch(`${API_URL}/questions`);
	if (!res.ok) throw new Error('Failed to fetch questions');
	return res.json();
}

export async function getAnswers(token: string): Promise<Answer[]> {
	const res = await fetch(`${API_URL}/answers`, {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});
	if (!res.ok) {
		if (res.status === 401) {
			throw new Error('Unauthorized - please sign in');
		}
		throw new Error('Failed to fetch answers');
	}
	return res.json();
}

export async function addOrUpdateAnswer(args: { question_id: number; answer_id: number; free_answer: string | null }, token: string): Promise<any> {
	const res = await fetch(`${API_URL}/answers`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify(args)
	});
	if (!res.ok) {
		if (res.status === 401) {
			throw new Error('Unauthorized - please sign in');
		}
		throw new Error('Failed to submit answer');
	}
	return res.json();
}

export async function getAnswerCounts(questionId: number): Promise<any> {
	const res = await fetch(`${API_URL}/answer_counts?question_id=${questionId}`);
	if (!res.ok) throw new Error('Failed to fetch answer counts');
	return res.json();
}