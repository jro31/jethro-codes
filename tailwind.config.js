const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      '2xs': '384px',
      xs: '512px',
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      typography: {
        DEFAULT: {
          css: {
            code: {
              '&:before': {
                content: 'none !important',
              },
              '&:after': {
                content: 'none !important',
              },
              color: '#232629',
              backgroundColor: '#e3e6e8',
              padding: '0.25rem',
              borderRadius: '0.25rem',
              fontWeight: 400,
            },
            pre: {
              code: {
                backgroundColor: '#1f2937',
                color: '#e5e7eb',
                padding: 0,
              },
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
