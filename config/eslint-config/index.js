module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],

  rules: {
    "react/react-in-jsx-scope": "off",
  },

  settings: {
    react: {
      version: "detect",
    },
  },

  overrides: [{ files: ["*.ts", "*.tsx", "*.js"] }],
}
