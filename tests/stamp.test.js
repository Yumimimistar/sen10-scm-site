"use strict";

const {
  padNumber,
  buildConfigId,
  formatLoadTime,
  makeBaselineStamp,
  stampPage
} = require("../js/stamp.js");

const parts = {
  product: "sc",
  country: "ph",
  release: 2,
  version: 1,
  type: "wb",
  format: "ht"
};
const loadedAt = new Date("2026-10-29T14:05:09Z");

describe("padNumber", () => {
  test("pads short numbers with leading zeros", () => {
    expect(padNumber(1, 3)).toBe("001");
    expect(padNumber(42, 3)).toBe("042");
  });

  test("does not cut numbers that are already long enough", () => {
    expect(padNumber(1234, 3)).toBe("1234");
  });
});

describe("buildConfigId", () => {
  test("follows the PP.CC.RRR.VVV.TT.FF naming model", () => {
    expect(buildConfigId(parts)).toBe("SC.PH.002.001.WB.HT");
  });
});

describe("formatLoadTime", () => {
  test("formats the date in UTC without seconds", () => {
    expect(formatLoadTime(loadedAt)).toBe("2026-10-29 14:05 UTC");
  });
});

describe("makeBaselineStamp", () => {
  test("combines the configuration ID and the load time", () => {
    expect(makeBaselineStamp(parts, loadedAt)).toBe(
      "Baseline SC.PH.002.001.WB.HT · loaded 2026-10-29 14:05 UTC"
    );
  });
});

describe("stampPage", () => {
  test("writes the stamp into the element and returns it", () => {
    const element = { textContent: "" };
    const text = stampPage(element, parts, loadedAt);
    expect(element.textContent).toBe(text);
    expect(text).toContain("SC.PH.002.001.WB.HT");
  });

  test("does nothing when the element is missing", () => {
    expect(stampPage(null, parts, loadedAt)).toBeNull();
  });
});
