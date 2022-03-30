/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/**/*.spec.ts(x)?"],
  collectCoverageFrom: ["src/**/*.ts(x)?"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy",
  },
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
}
