import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "next-env.d.ts",
      "node_modules/**",
      "out/**",
      "postcss.config.js",
      "tailwind.config.js",
    ],
  },
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      // `set-state-in-effect` was added in eslint-plugin-react-hooks 7.1.
      // The existing setState-in-effect patterns (hydration flags, prop sync)
      // are pre-existing code-quality items tracked for Phase 4 of the audit
      // plan — disabling here to keep the pnpm migration zero-behaviour.
      // TODO(phase-4): re-enable and refactor the 5 violations.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
