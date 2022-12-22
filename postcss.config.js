module.exports = {
  plugins: [
    [
      "postcss-import",
      {
        path: ["node_modules", "./src"],
      },
    ],
    "postcss-simple-vars",
    "postcss-mixins",
    "postcss-nested",
    "autoprefixer",
  ],
};
