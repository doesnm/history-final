import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kz: {
          blue: '#00AFCA',
          'blue-dark': '#0095AD',
          gold: '#FEC50C',
          'gold-dark': '#E5B000',
          sky: '#E6F7FB',
          sand: '#FFF8E1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'flip': 'flip 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        flip: { '0%': { transform: 'rotateY(0)' }, '100%': { transform: 'rotateY(180deg)' } },
      },
    },
  },
  plugins: [],
};

export default config;
