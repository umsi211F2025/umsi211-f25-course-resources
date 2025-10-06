/**
 * Registration page for user sign-up.
 *
 * Responsibilities:
 * - Generates a random username or allows user to enter a custom one.
 * - Calls onRegister callback with the chosen username.
 *
 * Data Flow:
 * - Manages username state locally.
 * - Notifies parent App of registration via onRegister prop.
 */

import React, { useState } from 'react';
import './RegistrationPage.css';

const adjectives = [
	'Brave', 'Clever', 'Witty', 'Calm', 'Swift', 'Lucky', 'Bold', 'Bright', 'Chill', 'Jolly', 'Mighty', 'Nimble', 'Quirky', 'Silly', 'Zesty', 'Happy', 'Sunny', 'Wise', 'Zany', 'Daring'
];
const nouns = [
	'Otter', 'Falcon', 'Tiger', 'Panda', 'Koala', 'Eagle', 'Wolf', 'Fox', 'Bear', 'Hawk', 'Lion', 'Moose', 'Rabbit', 'Seal', 'Shark', 'Swan', 'Toad', 'Whale', 'Yak', 'Zebra'
];

function randomUsername() {
	const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
	const noun = nouns[Math.floor(Math.random() * nouns.length)];
	return `${adj}${noun}${Math.floor(Math.random() * 1000)}`;
}

export default function RegistrationPage({ onRegister }: { onRegister: (username: string) => void }) {
	const [username, setUsername] = useState(randomUsername());
	const [custom, setCustom] = useState(false);

	return (
		<div className="registration-container">
			<h2>Choose a username</h2>
			<p>Your username will be used to track your survey answers.</p>
			<input
				type="text"
				value={username}
				onChange={e => { setUsername(e.target.value); setCustom(true); }}
				className="username-input"
			/>
			<div className="button-container">
				<button onClick={() => setUsername(randomUsername())} disabled={custom}>
					Generate Random Username
				</button>
			</div>
			<button
				className="start-button"
				onClick={() => onRegister(username.trim())}
				disabled={!username.trim()}
			>
				Start
			</button>
		</div>
	);
}