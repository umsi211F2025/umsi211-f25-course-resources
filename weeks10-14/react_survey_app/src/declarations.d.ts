declare module '../src/api.js' {
	export function getQuestions(): Promise<any>;
	export function getAnswers(userId: any): Promise<any>;
	export function addOrUpdateAnswer(args: any): Promise<any>;
	export function getAnswerCounts(questionId: any): Promise<any>;
}
declare module '../src/api.js';
declare module '*.css';
