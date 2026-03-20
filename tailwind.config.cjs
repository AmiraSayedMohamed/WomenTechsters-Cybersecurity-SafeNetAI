/** @type {import('tailwindcss').Config} */
    module.exports = {
      darkMode: ["class"],
      content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./App.tsx"],
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: 'hsl(221, 83%, 53%)',
              foreground: '#ffffff'
            },
            slate: {
              50: '#f8fafc',
              100: '#f1f5f9',
              200: '#e2e8f0',
              600: '#475569',
              900: '#0f172a'
            }
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            serif: ['Lora', 'serif'],
          }
        }
      },
      plugins: [require("tailwindcss-animate")],
    };