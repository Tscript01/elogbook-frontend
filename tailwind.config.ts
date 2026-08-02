import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd3ff',
          300: '#8eb7ff',
          400: '#5990ff',
          500: '#3369ff',
          600: '#1d47f5',
          700: '#1635e1',
          800: '#182db6',
          900: '#1a2c8f',
          950: '#141d57'
        },
        secondary: {
          50: '#f3f7f4',
          100: '#e1ebe3',
          200: '#c4d8c9',
          300: '#9bbca5',
          400: '#6d9a7c',
          500: '#4c7d5e',
          600: '#396349',
          700: '#2e4f3c',
          800: '#274031',
          900: '#213529',
          950: '#111d16'
        },
        parchment: {
          50: '#fdfcf8',
          100: '#f8f5ea',
          200: '#f0ead4',
          300: '#e3d8b4'
        }
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        serif: ['"Source Serif 4"', ...defaultTheme.fontFamily.serif]
      },
      boxShadow: {
        paper: '0 1px 2px rgba(16, 24, 40, 0.06), 0 8px 24px -12px rgba(16, 24, 40, 0.18)',
        rail: '0 0 0 1px rgba(16, 24, 40, 0.06)'
      }
    }
  }
}
