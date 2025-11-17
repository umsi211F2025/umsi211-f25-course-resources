/// <reference types="vite/client" />


// API utility for frontend to call backend endpoints
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Helper to get auth token from localStorage
function getAuthToken(): string | null {
	return localStorage.getItem('auth_token');
}

export interface Question {
	id: number;
	text: string;
	options: { id: number; text: string }[];
}

export interface Answer {
	question_id: number;
	answer_id: number | null;
	free_answer: string | null;
}

export interface AnswerCount {
	answer_id: number;
	count: number;
}

export async function getQuestions(): Promise<Question[]> {
	const res = await fetch(`${API_URL}/questions`);
	if (!res.ok) throw new Error('Failed to fetch questions');
	return res.json();
}

export async function getAnswers(): Promise<Answer[]> {
	const token = getAuthToken();
	if (!token) throw new Error('Not authenticated');
	
	const res = await fetch(`${API_URL}/answers`, {
		headers: {
			'Authorization': `Bearer ${token}`
		}
	});
	
	if (res.status === 401) {
		throw new Error('Session expired. Please login again.');
	}
	if (!res.ok) throw new Error('Failed to fetch answers');
	return res.json();
}

export async function addOrUpdateAnswer(args: { question_id: number; answer_id: number | null; free_answer: string | null }): Promise<any> {
	const token = getAuthToken();
	if (!token) throw new Error('Not authenticated');
	
	const res = await fetch(`${API_URL}/answers`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
		body: JSON.stringify(args)
	});
	
	if (res.status === 401) {
		throw new Error('Session expired. Please login again.');
	}
	if (!res.ok) throw new Error('Failed to submit answer');
	return res.json();
}

export async function getAnswerCounts(questionId: number): Promise<AnswerCount[]> {
	const res = await fetch(`${API_URL}/answer_counts?question_id=${questionId}`);
	if (!res.ok) throw new Error('Failed to fetch answer counts');
	return res.json();
}
