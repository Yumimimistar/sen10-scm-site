"use strict";

/*
 * Configuration baseline stamp.
 *
 * Applies the naming model from the SCM lecture (PP.CC.RRR.VVV.TT.FF) to this
 * very page. When the page loads, stampPage() writes the page's own
 * configuration ID and load time into the footer, e.g.
 *   Baseline SC.PH.002.001.WB.HT · loaded 2026-10-29 14:05 UTC
 *
 * The functions are pure, so Jest can test them in Node. In the browser the
 * same code is exposed as window.ConfigStamp.
 */
(function (root) {
  function padNumber(value, size) {
    return String(value).padStart(size, "0");
  }

  function buildConfigId(parts) {
    return [
      String(parts.product).toUpperCase(),
      String(parts.country).toUpperCase(),
      padNumber(parts.release, 3),
      padNumber(parts.version, 3),
      String(parts.type).toUpperCase(),
      String(parts.format).toUpperCase()
    ].join("-");
  }

  function formatLoadTime(date) {
    return date.toISOString().slice(0, 16).replace("T", " ") + " UTC";
  }

  function makeBaselineStamp(parts, date) {
    return "Baseline " + buildConfigId(parts) + " · loaded " + formatLoadTime(date);
  }

  function stampPage(element, parts, date) {
    if (!element) {
      return null;
    }
    const text = makeBaselineStamp(parts, date);
    element.textContent = text;
    return text;
  }

  const api = {
    padNumber: padNumber,
    buildConfigId: buildConfigId,
    formatLoadTime: formatLoadTime,
    makeBaselineStamp: makeBaselineStamp,
    stampPage: stampPage
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.ConfigStamp = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
