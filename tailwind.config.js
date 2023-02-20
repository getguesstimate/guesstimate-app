/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    colors: {
      blue: {
        1: "#1487d0",
        2: "#d0ecfd",
        3: "#d4deea",
        4: "#5a9dc1",
        5: "rgb(140, 166, 195)",
        6: "#002ebd",
        7: "#1678c2",
      },
      // previously called "black"
      dark: {
        1: "#111111",
        2: "#333",
        3: "#2d3137",
      },
      grey: {
        1: "#e7edf3",
        2: "#7089a9",
        4: "#aaa",
        5: "#f5f8fd",
        6: "#f7f5f5",
        7: "#dfe1e4",
        333: "#333",
        444: "#444",
        main: "#4e4e4e",
        666: "#666",
        888: "#888",
        999: "#999",
        bbb: "#bbb",
        ccc: "#ccc",
        eee: "#eee",
        a1: "rgb(231, 234, 236)",
      },
      green: {
        1: "#25b530",
        2: "#1eb128",
        3: "#084e14",
        4: "#c9e8c0",
      },
      purple: {
        1: "#7970a9",
        2: "#6c5a8c",
        3: "#ede4f9",
      },
      red: {
        1: "#e0b4b4",
        2: "#fff6f6",
        3: "#5f0909",
        4: "#a74b4b",
        5: "#db2828",
        6: "#e48585",
        7: "#eccac7",
        8: "#d48a8a",
      },
      white: "white",
      black: "black",
      transparent: "transparent",
    },
    extend: {
      borderRadius: {
        xs: "1px",
      },
      fontFamily: {
        open: "Open Sans,Helvetica,Arial,sans-serif",
        mono: '"Courier New", Courier, monospace',
      },
      maxWidth: {
        1200: "1200px",
      },
      fontSize: {
        "2xs": "11px",
      },
    },
  },
  plugins: [],
};
