const { pathsToModuleNameMapper } = require("ts-jest");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ["<rootDir>"],
  preset: "ts-jest",
  testMatch: ["**/*-test.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^gEngine/(.*)$": "<rootDir>/src/lib/engine/$1",
    "^gComponents/(.*)$": "<rootDir>/src/components/$1",
    "^gModules/(.*)$": "<rootDir>/src/modules/$1",
    "^lib/(.*)$": "<rootDir>/src/lib/$1",
    "^servers/(.*)$": "<rootDir>/src/server/$1",
  },
};
