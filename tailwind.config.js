/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Landscape phones and very short windows
      screens: { short: { raw: '(max-height: 500px)' } },
    },
  },
  plugins: [],
};
