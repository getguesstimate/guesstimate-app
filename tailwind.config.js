const themes = require("./src/themes/themes.json");
const semanticColors = Object.fromEntries(
  Object.entries(themes.light.colors).map(([name, value]) => [
    name,
    value.length === 7
      ? `rgb(var(--${name}-rgb) / <alpha-value>)`
      : `var(--${name})`,
  ])
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    colors: {
      ...semanticColors,
      ...{
        blue: {
          1: "rgb(var(--link-hover-rgb) / <alpha-value>)",
          2: "rgb(var(--border-rgb) / <alpha-value>)",
          3: "rgb(var(--switch-track-rgb) / <alpha-value>)",
          4: "rgb(var(--link-rgb) / <alpha-value>)",
          5: "rgb(var(--ink-subtle-rgb) / <alpha-value>)",
          6: "rgb(var(--link-hover-rgb) / <alpha-value>)",
          7: "rgb(var(--link-hover-rgb) / <alpha-value>)",
        },
        dark: {
          1: "rgb(var(--ink-strong-rgb) / <alpha-value>)",
          2: "rgb(var(--ink-strong-rgb) / <alpha-value>)",
          3: "rgb(var(--ink-strong-rgb) / <alpha-value>)",
        },
        grey: {
          1: "rgb(var(--accent-surface-rgb) / <alpha-value>)",
          2: "rgb(var(--ink-subtle-rgb) / <alpha-value>)",
          4: "rgb(var(--ink-subtle-rgb) / <alpha-value>)",
          5: "rgb(var(--page-rgb) / <alpha-value>)",
          6: "rgb(var(--page-rgb) / <alpha-value>)",
          7: "rgb(var(--border-rgb) / <alpha-value>)",
          333: "rgb(var(--ink-strong-rgb) / <alpha-value>)",
          444: "rgb(var(--ink-rgb) / <alpha-value>)",
          666: "rgb(var(--ink-muted-rgb) / <alpha-value>)",
          888: "rgb(var(--ink-subtle-rgb) / <alpha-value>)",
          999: "rgb(var(--ink-subtle-rgb) / <alpha-value>)",
          main: "rgb(var(--ink-rgb) / <alpha-value>)",
          bbb: "rgb(var(--ink-subtle-rgb) / <alpha-value>)",
          ccc: "rgb(var(--ink-subtle-rgb) / <alpha-value>)",
          eee: "rgb(var(--surface-muted-rgb) / <alpha-value>)",
          a1: "rgb(var(--border-rgb) / <alpha-value>)",
        },
        green: {
          1: "rgb(var(--success-rgb) / <alpha-value>)",
          2: "rgb(var(--success-rgb) / <alpha-value>)",
          3: "rgb(var(--success-rgb) / <alpha-value>)",
          4: "rgb(var(--success-surface-rgb) / <alpha-value>)",
          5: "rgb(var(--success-rgb) / <alpha-value>)",
          6: "rgb(var(--success-rgb) / <alpha-value>)",
          7: "rgb(var(--success-surface-rgb) / <alpha-value>)",
          8: "rgb(var(--success-border-rgb) / <alpha-value>)",
        },
        purple: {
          1: "rgb(var(--purple-rgb) / <alpha-value>)",
          2: "rgb(var(--purple-rgb) / <alpha-value>)",
          3: "rgb(var(--purple-surface-rgb) / <alpha-value>)",
          DEFAULT: "rgb(var(--purple-rgb) / <alpha-value>)",
        },
        red: {
          1: "rgb(var(--danger-border-rgb) / <alpha-value>)",
          2: "rgb(var(--danger-surface-rgb) / <alpha-value>)",
          3: "rgb(var(--danger-rgb) / <alpha-value>)",
          4: "rgb(var(--danger-rgb) / <alpha-value>)",
          5: "rgb(var(--danger-rgb) / <alpha-value>)",
          6: "rgb(var(--danger-rgb) / <alpha-value>)",
          7: "rgb(var(--danger-surface-rgb) / <alpha-value>)",
          8: "rgb(var(--danger-border-rgb) / <alpha-value>)",
        },
        white: "rgb(var(--surface-rgb) / <alpha-value>)",
        black: "rgb(var(--ink-strong-rgb) / <alpha-value>)",
        transparent: "transparent",
      },
    },
    extend: {
      borderRadius: {
        xs: "1px",
      },
      fontFamily: {
        lato: '"Lato", "Helvetica Neue", Arial, Helvetica, sans-serif',
        open: "Open Sans,Helvetica,Arial,sans-serif",
        mono: '"Courier New", Courier, monospace',
      },
      maxWidth: {
        1200: "1200px",
      },
      fontSize: {
        "2xs": "11px",
      },
      opacity: {
        95: ".95",
      },
    },
  },
  plugins: [],
};
