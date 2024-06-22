/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        trophy: {
          "primary": "#414535",
          "secondary": "#6A7FDB",
          "accent": "#eec6ca",
          "neutral": "#EDEDF4",
          "info": "#C6D4FF",
          "success": "#009485",
          "warning": "#eac435",
          "error": "#ff5724",
          "base-100": "#ffffff",
          "neutral-content": "#160016",
        },
      },
    ],
  },
  plugins: [
    require('daisyui')
  ],
  safelist: [
    {
      // make dynamic heights work - this might be a bad idea, maybe
      pattern: /h-./
    }
  ]
}

