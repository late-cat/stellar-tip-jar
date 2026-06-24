/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'stellar-purple': '#5A31F4',
        'stellar-purple-light': '#7B5AF6',
        'stellar-dark': '#0B0A11',
        'stellar-card': '#161421',
        'stellar-accent': '#00E5FF',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-stellar': 'linear-gradient(135deg, #0B0A11 0%, #161421 100%)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 15px rgba(0, 229, 255, 0.5)' },
          '50%': { opacity: .7, boxShadow: '0 0 5px rgba(0, 229, 255, 0.2)' },
        }
      }
    },
  },
  plugins: [],
};