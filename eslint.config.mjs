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
];

export default config;
