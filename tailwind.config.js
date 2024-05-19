/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light"],
  },
  plugins: [
    require('daisyui')
  ],
  safelist: [
    {
      // make dynamic alerts work
      pattern: /alert-.+/,
      // make dynamic heights work - this might be a bad idea, maybe
      pattern: /h-./
    }
  ]
}

