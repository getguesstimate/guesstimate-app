module.exports = {
  plugins: [
    require("postcss-import")({
      path: ["node_modules", "./src"],
    }),
    require("postcss-modules")({
      scopeBehaviour: "global",
    }),
    require("postcss-simple-vars"),
    require("postcss-mixins"),
    require("postcss-nested"),
    require("autoprefixer"),
  ],
};
