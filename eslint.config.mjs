import js from "@eslint/js";

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
        IntersectionObserver: "readonly"
      }
    },
    rules: {
      semi: ["error", "always"],
      eqeqeq: "error",
      "no-unused-vars": "error",
      "no-undef": "error",
      "prefer-const": "error"
    }
  }
];
