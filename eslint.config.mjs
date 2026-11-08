import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored third-party scripts served as-is (Umami tracker, the
    // COOP/COEP service worker) — linting code we don't author is noise.
    "public/**",
    // Agent worktrees live under .claude/worktrees/, which puts whole other
    // checkouts of this repo inside this one. Without this, `pnpm lint` walks
    // them and reports their files as ours.
    ".claude/**",
  ]),
]);

export default eslintConfig;
