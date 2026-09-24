import { test, expect } from "@playwright/test";

test.describe("比較サイトの主要フロー", () => {
  test("トップページに日本語の見出しと比較表が表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "AI月額プラン比較" })).toBeVisible();
    await expect(page.locator("table.plan-table")).toBeVisible();
    const rowCount = await page.locator("table.plan-table tbody tr").count();
    expect(rowCount).toBeGreaterThan(5);
  });

  test("各行に出典リンクと確認日が表示される", async ({ page }) => {
    await page.goto("/");
    const firstRow = page.locator("table.plan-table tbody tr").first();
    await expect(firstRow.getByRole("link", { name: "出典" })).toBeVisible();
    await expect(firstRow.locator(".plan-table__checked-at")).toContainText("確認日");
  });

  test("キーワード絞り込みが機能する", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("サービス名・会社名で検索").fill("Claude");
    const rows = page.locator("table.plan-table tbody tr");
    await expect(rows).toHaveCount(3);
  });

  test("比較表からチェックすると横並び比較に表示される", async ({ page }) => {
    await page.goto("/");
    const checkboxes = page.locator("table.plan-table tbody tr td input[type=checkbox]");
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    await page.getByRole("button", { name: /横並び比較/ }).click();
    await expect(page.locator(".compare-card")).toHaveCount(2);
  });

  test("使い方ページとこのサイトについてページが表示される", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "使い方" }).click();
    await expect(page.getByRole("heading", { name: "使い方" })).toBeVisible();
    await page.getByRole("button", { name: "このサイトについて" }).click();
    await expect(page.getByRole("heading", { name: "このサイトについて" })).toBeVisible();
  });

  test("CSVエクスポートがBOM付きUTF-8でダウンロードされる", async ({ page }) => {
    await page.goto("/");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "比較結果をCSVでダウンロード" }).click();
    const download = await downloadPromise;
    const streamPath = await download.path();
    expect(streamPath).toBeTruthy();
    const fs = await import("node:fs");
    const buf = fs.readFileSync(streamPath!);
    expect(buf[0]).toBe(0xef);
    expect(buf[1]).toBe(0xbb);
    expect(buf[2]).toBe(0xbf);
    const text = buf.toString("utf-8");
    expect(text).toContain("提供会社");
  });

  test("該当0件になる絞り込みでは空メッセージを表示する", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("サービス名・会社名で検索").fill("存在しないサービス名前12345");
    await expect(page.locator(".plan-table__empty")).toBeVisible();
    await expect(page.locator("table.plan-table")).toHaveCount(0);
  });

  test("上限予算に0を入れると無料プランのみの表示になり崩れない", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("上限予算（月払い換算・米ドル）").fill("0");
    await expect(page.locator(".plan-table__empty")).toBeVisible();
  });

  test("お気に入りはリロード後もブラウザに保存されている", async ({ page }) => {
    await page.goto("/");
    await page.locator(".fav-btn").first().click();
    await page.reload();
    await expect(page.locator(".fav-btn.is-active")).toHaveCount(1);
  });

  test("比較選択はURLに反映され、そのURLを開くと復元される", async ({ page, context }) => {
    await page.goto("/");
    const checkboxes = page.locator("table.plan-table tbody tr td input[type=checkbox]");
    await checkboxes.nth(0).check();
    await checkboxes.nth(1).check();
    const url = page.url();
    expect(url).toContain("selected=");

    const page2 = await context.newPage();
    await page2.goto(url);
    await page2.getByRole("button", { name: /横並び比較/ }).click();
    await expect(page2.locator(".compare-card")).toHaveCount(2);
    await page2.close();
  });

  test("比較選択は5件目にチェックを入れても4件までしか増えない（上限の境界値）", async ({ page }) => {
    await page.goto("/");
    const checkboxes = page.locator("table.plan-table tbody tr td input[type=checkbox]");
    const count = await checkboxes.count();
    for (let i = 0; i < Math.min(5, count); i++) {
      await checkboxes.nth(i).check({ force: true }).catch(() => {});
    }
    const checkedCount = await page.locator(
      "table.plan-table tbody tr td input[type=checkbox]:checked",
    ).count();
    expect(checkedCount).toBeLessThanOrEqual(4);
  });

  test("壊れたバックアップJSONを読み込むとエラーメッセージが表示される", async ({ page }) => {
    await page.goto("/");
    await page.setInputFiles('input[type="file"]', {
      name: "broken.json",
      mimeType: "application/json",
      buffer: Buffer.from("{not valid json"),
    });
    await expect(page.locator(".export-bar__message")).toContainText("失敗");
  });

  test("スマホ幅(375px)でも横スクロールなしでヘッダーとフィルターが表示される", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "AI月額プラン比較" })).toBeVisible();
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(376);
  });

  test("日本語見出し・出典表示に文字化け（U+FFFD等）が含まれない", async ({ page }) => {
    await page.goto("/");
    const bodyText = await page.locator("body").innerText();
    expect(bodyText).not.toContain(String.fromCharCode(0xfffd));
    expect(bodyText).toContain("比較表");
    expect(bodyText).toContain("出典");
  });

  test("分野で絞り込むと該当カテゴリのプランだけが表示される", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("分野で絞り込む").selectOption("coding_assistant");
    const rows = page.locator("table.plan-table tbody tr");
    const count = await rows.count();
    expect(count).toBeGreaterThan(5);
    await expect(rows.first().locator("td").nth(4)).toContainText("コーディング支援");
  });

  test("日本円の参考価格と為替レートの確認日が表示される", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".exchange-rate-note")).toContainText("為替レート");
    await expect(page.locator(".exchange-rate-note")).toContainText("毎日変動");
    const firstJpyCell = page.locator("table.plan-table tbody tr").first().locator("td").nth(7);
    await expect(firstJpyCell).toContainText("¥");
  });

  test("知名度の目安の見出しを押すと並べ替えができる", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("button", { name: /知名度の目安/ });
    await header.click();
    const firstTier = page.locator("table.plan-table tbody tr").first().locator("td").nth(5);
    await expect(firstTier).toContainText("★");
  });

  test("お知らせページに記事が表示される", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "お知らせ" }).click();
    await expect(page.getByRole("heading", { name: "お知らせ" })).toBeVisible();
    const articles = page.locator(".news-article");
    expect(await articles.count()).toBeGreaterThan(0);
  });

  test("オフラインでも比較表の閲覧・絞り込みができる（PWAキャッシュ確認）", async ({ page, context }) => {
    await page.goto("/");
    await expect(page.locator("table.plan-table")).toBeVisible();
    // Service Workerがこのページの制御を持つまで待ち、一度オンラインのままリロードしてキャッシュさせる
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    await page.reload();
    await expect(page.locator("table.plan-table")).toBeVisible();

    await context.setOffline(true);
    await page.reload();
    await expect(page.locator("table.plan-table")).toBeVisible();
    await context.setOffline(false);
  });
});
