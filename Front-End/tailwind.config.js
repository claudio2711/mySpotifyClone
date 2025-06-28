/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:  '#1DB954',   // verde Spotify
        surface:  '#121212',
        surface2: '#181818',
      },
      boxShadow: {
        card: '0 4px 12px 0 rgb(0 0 0 / 0.4)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],               // nessun plugin vite→tailwind
};
