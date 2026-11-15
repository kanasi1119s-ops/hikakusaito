import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AffiliateCta } from "../AffiliateCta";

describe("AffiliateCta", () => {
  it("PR表記を表示する", () => {
    render(<AffiliateCta label="テスト公式サイトへ" />);
    expect(screen.getByText("PR")).toBeInTheDocument();
    expect(screen.getByText("テスト公式サイトへ（準備中）")).toBeInTheDocument();
  });

  it("未提携であることを示す data-affiliate=\"pending\" を持つ", () => {
    render(<AffiliateCta label="テスト公式サイトへ" />);
    const link = screen.getByRole("link", { name: /PRテスト公式サイトへ/ });
    expect(link).toHaveAttribute("data-affiliate", "pending");
    expect(link).toHaveAttribute("href", "#");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });

  it("クリックしてもページ遷移しない（preventDefaultされる）", () => {
    render(<AffiliateCta label="テスト公式サイトへ" />);
    const link = screen.getByRole("link", { name: /PRテスト公式サイトへ/ });
    const clickEvent = fireEvent.click(link);
    expect(clickEvent).toBe(false);
  });
});
