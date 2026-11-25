import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Data-loading effects intentionally call setState to reflect loading /
      // error state after an async fetch. That is the idiomatic React pattern,
      // so this rule is too strict for this app.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    // Context modules necessarily export both the Provider component and its
    // hook, which the fast-refresh lint rule does not allow.
    files: ['**/contexts/**/*.{js,jsx}', '**/components/kit.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
