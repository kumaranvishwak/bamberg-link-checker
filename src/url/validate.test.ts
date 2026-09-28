import { describe, expect, test } from "vitest";
import { findUrlProblem } from "./validate";

describe("findUrlProblem", () => {
  test("accepts normal links", () => {
    expect(findUrlProblem("https://uni-bamberg.example")).toBeNull();
    expect(
      findUrlProblem("http://faessla-kitchen.example/menu/beer-list.txt"),
    ).toBeNull();
    expect(findUrlProblem("  https://kumaran-portfolio.example/  ")).toBeNull();
    expect(
      findUrlProblem("https://kumaran-portfolio.example/projects/"),
    ).toBeNull(); 
  });

  test("rejects links that are still being typed", () => {
    expect(findUrlProblem("h")).not.toBeNull();
    expect(findUrlProblem("https://")).not.toBeNull();
    expect(findUrlProblem("https://uni")).not.toBeNull();
    expect(findUrlProblem("https://uni-bamberg.e")).not.toBeNull();
      expect(findUrlProblem("https://faessla")).not.toBeNull();
  });

  test("rejects other schemes", () => {
    expect(findUrlProblem("ftp://uni-bamberg.example")).toContain("ftp:");
    expect(findUrlProblem("javascript:alert(1)")).not.toBeNull();
  });

  test("empty input", () => {
    expect(findUrlProblem("   ")).toBe("Type a link first");
  });
});
