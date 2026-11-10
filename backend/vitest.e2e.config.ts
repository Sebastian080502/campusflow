import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.e2e-spec.ts"],
    globals: true,
    testTimeout: 60000,
    hookTimeout: 120000,
    fileParallelism: false,
  },
});
