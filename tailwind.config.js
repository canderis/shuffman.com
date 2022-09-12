// tailwind.config.js
const colors = require('tailwindcss/colors');

module.exports = {
	mode: 'jit',
	purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
	corePlugins: {
		container: false,
	},
	theme: {
		colors: {
			...colors,
			grey: {
				200: '#979797',
				900: '#0F0F0F'
			},
		},
		extend: {},
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
			serif: ['Bebas Neue', 'serif'],
		},
	},

	variants: {},
	plugins: [],
};
