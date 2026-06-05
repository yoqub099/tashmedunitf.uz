import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**", "next-env.d.ts"],
  },
  {
    rules: {
      // Keep as errors: real correctness bugs
      "react-hooks/rules-of-hooks": "error",

      // React 19 strict-mode performance/style hints — demoted to warnings.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/preserve-manual-memoization": "warn",

      // Next.js performance hints — demoted to warnings
      "@next/next/no-html-link-for-pages": "warn",
      "@next/next/no-img-element": "warn",

      // React style preferences — demoted to warnings
      "react/no-unescaped-entities": "warn",
      "react/no-children-prop": "warn",
    },
  },
];

export default eslintConfig;
