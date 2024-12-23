import globals from "globals";
import pluginJs from "@eslint/js";
import stylistic from '@stylistic/eslint-plugin-js'

export default [
  {
    ignores: ["app/migrations/*"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType:  "module",
      globals:     {
        ...globals.node,
      },
    },
    plugins: {
      '@stylistic/js': stylistic,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      "no-unused-vars":       "warn",
      "comma-dangle":         ["error", {
        "arrays":    "always-multiline",
        "objects":   "always-multiline",
        "imports":   "always-multiline",
        "exports":   "always-multiline",
        "functions": "always-multiline",
      }],
      "key-spacing": [ 2, {
        "singleLine": { "beforeColon": false, "afterColon": true },
        "multiLine":  { "beforeColon": false, "afterColon": true },
        "align":      { "beforeColon": false, "afterColon": true, "on": "value" },
      }],
      "space-before-function-paren": ["error", {
        "anonymous":  "always",
        "named":      "never",
        "asyncArrow": "always",
      }],
    },
  },
  pluginJs.configs.recommended,
];