import js from "@eslint/js";

const rules = {
  semi: ["error", "always"],
  eqeqeq: "error",
  "no-unused-vars": "error",
  "no-undef": "error",
  "prefer-const": "error"
};

export default [
  js.configs.recommended,
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        module: "writable",
        IntersectionObserver: "readonly",
        ConfigStamp: "readonly"
      }
    },
    rules: rules
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        describe: "readonly",
        test: "readonly",
        expect: "readonly"
      }
    },
    rules: rules
  }
];
