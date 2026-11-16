export default {
  title: "Banner",
  className: ".mdst-banner",
  keywords: ["alert", "callout", "notice", "message"],
  description:
    "Full-width message strip for cookie consent, alerts, and announcements. Sits in the page flow, sticks to the top or bottom of a section, or fixes to the viewport. Tone classes (`.mdst-danger` and friends) add an accent edge; visibility is driven by `data-state`.",
  // Kept working until 3.0, left out of llms.txt; use the tone classes
  deprecated: [".mdst-banner--danger", ".mdst-banner--success", ".mdst-banner--warning", ".mdst-banner--info"],
};
