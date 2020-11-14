const path = require("path");

module.exports = {
  outputDir: "../server/public",
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    },
    "resolve-alias": {
      alias: {
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@components": path.resolve(__dirname, "./src/components")
      }
    }
  }
};
