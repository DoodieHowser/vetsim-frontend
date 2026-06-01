module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      animation: {
        'grade-pop': 'grade-pop 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'grade-glow': 'grade-glow 2s ease-in-out 0.65s infinite',
      },
      keyframes: {
        'grade-pop': {
          '0%':   { transform: 'scale(0)', opacity: '0' },
          '60%':  { transform: 'scale(1.18)' },
          '80%':  { transform: 'scale(0.94)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'grade-glow': {
          '0%, 100%': { boxShadow: '0 0 8px 2px var(--glow-color)' },
          '50%':      { boxShadow: '0 0 20px 6px var(--glow-color)' },
        },
      },
    },
  },
  plugins: [],
};
