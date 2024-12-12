import globals from "globals";
import pluginJs from "@eslint/js";
import jest from 'eslint-plugin-jest';

export default [
  {
    ignores: ["dist/"]
  },
  {
  plugins: {jest},
    rules: {
      ...jest.configs.recommended.rules,
    }
  },
  {
    languageOptions: { 
      globals: {
        ...globals.browser, 
        ...globals.node, 
        ...globals.jest
      } 
    }
  },
  pluginJs.configs.recommended,
];