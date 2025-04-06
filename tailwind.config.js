import backgroundPatterns from './tailwindPatternPlugin.js';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			keyframes: {
				wiggle: {
					'0%, 100%': { transform: 'rotate(-15deg)' },
					'50%': { transform: 'rotate(15deg)' }
				}
			},
			animation: {
				wiggle: 'wiggle 1s ease-in-out infinite'
			},
		},
	},
	safelist: [
		'bg-gradient-to-r',
		'bg-gradient-to-br',
		'bg-gradient-to-tr',
		'from-pink-500',
		'via-red-500',
		'to-yellow-500',
		'from-blue-400',
		'via-teal-400',
		'to-green-400',
		'from-indigo-700',
		'via-purple-600',
		'to-pink-600'
	],
	plugins: [backgroundPatterns],
};
