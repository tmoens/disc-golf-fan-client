export const environment = {
  production: true,
  // Relative path when your frontend and backend are served from same origin behind a prefix
  apiBaseUrl: '/dg-fan-server',
  polling: {
    liveScoresMs: 60_000,
    detailedScoresMs: 60_000,
    adminDashMs: 2_000,
  },
  logging: {
    enableDebug: false,
  },
} as const;
