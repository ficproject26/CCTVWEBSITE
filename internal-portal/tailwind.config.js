/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'xs':   ['13px', { lineHeight: '20px' }],
        'sm':   ['14px', { lineHeight: '22px' }],
        'base': ['15px', { lineHeight: '24px' }],
        'lg':   ['17px', { lineHeight: '26px' }],
        'xl':   ['19px', { lineHeight: '28px' }],
        '2xl':  ['22px', { lineHeight: '32px' }],
        '3xl':  ['28px', { lineHeight: '38px' }],
      },
      colors: {
        primary: {
          DEFAULT: '#00875A',
          dark: '#00704A',
          light: '#E6F4EA',
        },
        slate: {
          950: '#0B0F19',
        }
      }
    },
  },
  plugins: [],
}
