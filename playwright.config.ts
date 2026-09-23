import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";

// 開発コンテナにプリインストールされたChromiumがあればそれを使い、
// なければ（CI等では）Playwright標準のブラウザ解決に任せる。
const preinstalledChromium = "/opt/pw-browsers/chromium";
const executablePath = existsSync(preinstalledChromium) ? preinstalledChromium : undefined;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  webServer: {
    command: "npm run preview -- --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: true,
    timeout: 60_000,
  },
  use: {
    baseURL: "http://localhost:4173",
    launchOptions: executablePath ? { executablePath } : {},
  },
});
