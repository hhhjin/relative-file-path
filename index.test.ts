import { describe, expect, test } from "vitest";

import { relativeFilePath as rfpCode } from "./index";
import { relativeFilePath as rfpCjs } from "./dist/index";
import { relativeFilePath as rfpEsm } from "./dist/index.mjs";

let rfp: typeof rfpCode;
if (process.env.TEST_ENV === "CODE") {
  rfp = rfpCode;
} else if (process.env.TEST_ENV === "CJS") {
  rfp = rfpCjs;
} else {
  rfp = rfpEsm;
}

describe("throw error", () => {
  test("PathTypeError", () => {
    expect(() => rfp("a.js", "/b.js")).toThrowError(
      "Both parameters must begin with '/' or not"
    );
    expect(() => rfp("/a.js", "b.js")).toThrowError(
      "Both parameters must begin with '/' or not"
    );
  });

  test("", ({ task }) => {
    expect(() => rfp("/a.js/", "/b.js/")).toThrowError(
      "Both parameters must not end with '/'"
    );
    expect(() => rfp("/a.js/", "/b.js")).toThrowError(
      "Both parameters must not end with '/'"
    );
    expect(() => rfp("/a.js", "/b.js/")).toThrowError(
      "Both parameters must not end with '/'"
    );
  });
});

describe("./", () => {
  test("./file", () => {
    expect(rfp("/a.js", "/b.js")).toBe("./b.js");
    expect(rfp("a.js", "b.js")).toBe("./b.js");

    expect(rfp("/a/b.js", "/a/c.js")).toBe("./c.js");
    expect(rfp("a/b.js", "a/c.js")).toBe("./c.js");

    expect(rfp("/a/b/c.js", "/a/b/d.js")).toBe("./d.js");
    expect(rfp("a/b/c.js", "a/b/d.js")).toBe("./d.js");
  });

  test("./dir1/file", () => {
    expect(rfp("/a.js", "/b/c.js")).toBe("./b/c.js");
    expect(rfp("a.js", "b/c.js")).toBe("./b/c.js");

    expect(rfp("/a/b.js", "/a/c/d.js")).toBe("./c/d.js");
    expect(rfp("a/b.js", "a/c/d.js")).toBe("./c/d.js");

    expect(rfp("/a/b/c.js", "/a/b/d/e.js")).toBe("./d/e.js");
    expect(rfp("a/b/c.js", "a/b/d/e.js")).toBe("./d/e.js");
  });

  test("./dir1/dir2/file", () => {
    expect(rfp("/a.js", "/b/c/d.js")).toBe("./b/c/d.js");
    expect(rfp("a.js", "b/c/d.js")).toBe("./b/c/d.js");

    expect(rfp("/a/b.js", "/a/c/d/e.js")).toBe("./c/d/e.js");
    expect(rfp("a/b.js", "a/c/d/e.js")).toBe("./c/d/e.js");

    expect(rfp("/a/b/c.js", "/a/b/d/e/f.js")).toBe("./d/e/f.js");
    expect(rfp("a/b/c.js", "a/b/d/e/f.js")).toBe("./d/e/f.js");
  });
});

describe("../", () => {
  test("../file", () => {
    expect(rfp("/a/b.js", "/c.js")).toBe("../c.js");
    expect(rfp("a/b.js", "c.js")).toBe("../c.js");

    expect(rfp("/a/b/c.js", "/a/d.js")).toBe("../d.js");
    expect(rfp("a/b/c.js", "a/d.js")).toBe("../d.js");

    expect(rfp("/a/b/c/d.js", "/a/b/e.js")).toBe("../e.js");
    expect(rfp("a/b/c/d.js", "a/b/e.js")).toBe("../e.js");
  });

  test("../dir1/file", () => {
    expect(rfp("/a/b.js", "/c/d.js")).toBe("../c/d.js");
    expect(rfp("a/b.js", "c/d.js")).toBe("../c/d.js");

    expect(rfp("/a/b/c.js", "/a/d/e.js")).toBe("../d/e.js");
    expect(rfp("a/b/c.js", "a/d/e.js")).toBe("../d/e.js");

    expect(rfp("/a/b/c/d.js", "/a/b/e/f.js")).toBe("../e/f.js");
    expect(rfp("a/b/c/d.js", "a/b/e/f.js")).toBe("../e/f.js");
  });

  test("../dir1/dir2/file", () => {
    expect(rfp("/a/b.js", "/c/d/e.js")).toBe("../c/d/e.js");
    expect(rfp("a/b.js", "c/d/e.js")).toBe("../c/d/e.js");

    expect(rfp("/a/b/c.js", "/a/d/e/f.js")).toBe("../d/e/f.js");
    expect(rfp("a/b/c.js", "a/d/e/f.js")).toBe("../d/e/f.js");

    expect(rfp("/a/b/c/d.js", "/a/b/e/f/g.js")).toBe("../e/f/g.js");
    expect(rfp("a/b/c/d.js", "a/b/e/f/g.js")).toBe("../e/f/g.js");
  });
});

describe("../../", () => {
  test("../../file", () => {
    expect(rfp("/a/b/c.js", "/d.js")).toBe("../../d.js");
    expect(rfp("a/b/c.js", "d.js")).toBe("../../d.js");

    expect(rfp("/a/b/c/d.js", "/a/e.js")).toBe("../../e.js");
    expect(rfp("a/b/c/d.js", "a/e.js")).toBe("../../e.js");

    expect(rfp("/a/b/c/d/e.js", "/a/b/f.js")).toBe("../../f.js");
    expect(rfp("a/b/c/d/e.js", "a/b/f.js")).toBe("../../f.js");
  });

  test("../../dir1/file", () => {
    expect(rfp("/a/b/c.js", "/d/e.js")).toBe("../../d/e.js");
    expect(rfp("a/b/c.js", "d/e.js")).toBe("../../d/e.js");

    expect(rfp("/a/b/c/d.js", "/a/e/f.js")).toBe("../../e/f.js");
    expect(rfp("a/b/c/d.js", "a/e/f.js")).toBe("../../e/f.js");

    expect(rfp("/a/b/c/d/e.js", "/a/b/f/g.js")).toBe("../../f/g.js");
    expect(rfp("a/b/c/d/e.js", "a/b/f/g.js")).toBe("../../f/g.js");
  });

  test("../../dir1/dir2/file", () => {
    expect(rfp("/a/b/c.js", "/d/e/f.js")).toBe("../../d/e/f.js");
    expect(rfp("a/b/c.js", "d/e/f.js")).toBe("../../d/e/f.js");

    expect(rfp("/a/b/c/d.js", "/a/e/f/g.js")).toBe("../../e/f/g.js");
    expect(rfp("a/b/c/d.js", "a/e/f/g.js")).toBe("../../e/f/g.js");

    expect(rfp("/a/b/c/d/e.js", "/a/b/f/g/h.js")).toBe("../../f/g/h.js");
    expect(rfp("a/b/c/d/e.js", "a/b/f/g/h.js")).toBe("../../f/g/h.js");
  });
});

describe("../../../", () => {
  test("../../../file", () => {
    expect(rfp("/a/b/c/d.js", "/e.js")).toBe("../../../e.js");
    expect(rfp("a/b/c/d.js", "e.js")).toBe("../../../e.js");

    expect(rfp("/a/b/c/d/e.js", "/a/f.js")).toBe("../../../f.js");
    expect(rfp("a/b/c/d/e.js", "a/f.js")).toBe("../../../f.js");

    expect(rfp("/a/b/c/d/e/f.js", "/a/b/g.js")).toBe("../../../g.js");
    expect(rfp("a/b/c/d/e/f.js", "a/b/g.js")).toBe("../../../g.js");
  });

  test("../../../dir1/file", () => {
    expect(rfp("/a/b/c/d.js", "/e/f.js")).toBe("../../../e/f.js");
    expect(rfp("a/b/c/d.js", "e/f.js")).toBe("../../../e/f.js");

    expect(rfp("/a/b/c/d/e.js", "/a/f/g.js")).toBe("../../../f/g.js");
    expect(rfp("a/b/c/d/e.js", "a/f/g.js")).toBe("../../../f/g.js");

    expect(rfp("/a/b/c/d/e/f.js", "/a/b/g/h.js")).toBe("../../../g/h.js");
    expect(rfp("a/b/c/d/e/f.js", "a/b/g/h.js")).toBe("../../../g/h.js");
  });

  test("../../../dir1/dir2/file", () => {
    expect(rfp("/a/b/c/d.js", "/e/f/g.js")).toBe("../../../e/f/g.js");
    expect(rfp("a/b/c/d.js", "e/f/g.js")).toBe("../../../e/f/g.js");

    expect(rfp("/a/b/c/d/e.js", "/a/f/g/h.js")).toBe("../../../f/g/h.js");
    expect(rfp("a/b/c/d/e.js", "a/f/g/h.js")).toBe("../../../f/g/h.js");

    expect(rfp("/a/b/c/d/e/f.js", "/a/b/g/h/i.js")).toBe("../../../g/h/i.js");
    expect(rfp("a/b/c/d/e/f.js", "a/b/g/h/i.js")).toBe("../../../g/h/i.js");
  });
});
