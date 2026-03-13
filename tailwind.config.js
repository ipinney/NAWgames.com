/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'naw-purple': '#7c3aed',
        'naw-cyan': '#06b6d4',
        'naw-green': '#10b981',
        'naw-orange': '#f59e0b',
        'naw-pink': '#ec4899',
        'naw-dark': '#0f0b1a',
        'naw-card': '#1a1330',
      },
      fontFamily: {
        'game': ['"Press Start 2P"', 'monospace'],
      },
    },
  },
  plugins: [],
};
