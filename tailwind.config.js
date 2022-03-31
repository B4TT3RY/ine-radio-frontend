module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /bg-/,
      variants: ['hover', 'focus'],
    },
  ],
  plugins: [require('@tailwindcss/forms'), require('tailwindcss-safe-area')],
}
