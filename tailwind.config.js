/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#a5b4fc',
          DEFAULT: '#6366F1',
          dark: '#4F46E5',
        },
        secondary: {
          light: '#6ee7b7',
          DEFAULT: '#10B981',
          dark: '#047857',
        },
        background: '#F9FAFB',
        text: '#1F2937',
        accent: '#F43F5E',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Use 'Inter' as the font family
      },
    },
  },
  plugins: [],
};
