/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
  purge: [
    // Paths to your Nuxt.js templates and components
    './pages/surveys/**/*.vue',
    './pages/surveys/Sections/**/*.vue',
    './pages/surveys/MiniSections/**/*.vue',
  ],
}

