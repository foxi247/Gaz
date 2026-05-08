/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      colors: {
        graphite: '#171717',
        mist: '#F3F3F5',
        ink: '#242424',
        muted: '#767676',
        success: '#18A058',
        danger: '#E34B6A'
      },
      boxShadow: {
        soft: '0 18px 60px rgba(22, 22, 22, 0.08)',
        card: '0 10px 30px rgba(20, 20, 20, 0.07)'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
};
