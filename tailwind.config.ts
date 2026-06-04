import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        choco: {
          50:  '#FDF6EC',
          100: '#F5E6D3',
          200: '#E8C9A0',
          300: '#D4A876',
          400: '#C68642',
          500: '#A0612A',
          600: '#7A4520',
          700: '#5C3217',
          800: '#3D1C02',
          900: '#2C1A0E',
          950: '#160C01',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        assistant: ['var(--font-assistant)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'pinup-dots': 'radial-gradient(circle, #C68642 1px, transparent 1px)',
      },
      backgroundSize: {
        'dots-sm': '20px 20px',
      },
    },
  },
  plugins: [],
}

export default config
