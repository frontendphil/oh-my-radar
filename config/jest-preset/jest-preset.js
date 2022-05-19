const tsJest = require("ts-jest")

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...tsJest.createJestPreset(),

  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/*.spec.ts(x)?"],
  collectCoverageFrom: ["src/**/*.ts(x)?"],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
  },
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
}
