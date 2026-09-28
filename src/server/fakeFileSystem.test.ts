import { expect, test } from "vitest";
import { findEntry } from "./fakeFileSystem";

const at = (link: string) => findEntry(new URL(link));

test("folders with and without trailing slash", () => {
  expect(at("https://uni-bamberg.example/lectures")).toBe("folder");
  expect(at("https://uni-bamberg.example/lectures/")).toBe("folder");
  expect(at("https://uni-bamberg.example/")).toBe("folder");
});

test("files", () => {
  expect(
    at("https://uni-bamberg.example/lectures/isosysc/slides-week3.pdf"),
  ).toBe("file");
  expect(
    at("https://kumaran-portfolio.example/projects/zauberfit/readme.md"),
  ).toBe("file");
  expect(at("https://uni-bamberg.example/library/study-rooms.pdf")).toBe(
    "file",
  );
});

test("things that do not exist", () => {
  expect(at("https://uni-bamberg.example/mensa/")).toBeNull();
  expect(
    at("https://faessla-kitchen.example/menu/beer-list.txt/more"),
  ).toBeNull();
  expect(at("https://some-other-site.example/")).toBeNull();
});
