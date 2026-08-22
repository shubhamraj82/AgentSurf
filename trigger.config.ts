import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: "proj_dvunqlrloirtykollrpb",
  runtime: "node",
  logLevel: "log",
  // The max compute seconds a task is allowed to run. If the task run exceeds this duration, it will be stopped.
  // You can override this on an individual task.
  // See https://trigger.dev/docs/runs/max-duration
  maxDuration: 3600,
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  build: {
    // Stagehand loads its bundled Chrome extension ZIP from its package directory
    // when Browserbase sessions are created. Keep the package external so Trigger
    // installs that runtime asset instead of bundling only its JavaScript entrypoint.
    external: ["@browserbasehq/stagehand"],
  },
  dirs: ["features"],
});
