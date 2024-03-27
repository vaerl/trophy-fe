/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "dark"],
  },
  plugins: [
    require('daisyui')
  ],
  safelist: [
    {
      // make dynamic alerts work
      pattern: /alert-.+/,
    }
  ]
}

