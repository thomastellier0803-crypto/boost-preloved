import type { AnalysisResult, Platform } from "./resell-data";

export const LEBONCOIN_MENTION = "Envoi rapide et soigné ou remise en main propre.";

function stripHashtags(text: string) {
  return text
    .split("\n")
    .map((line) => line.replace(/#[\p{L}\p{N}_-]+/gu, "").trimEnd())
    .filter((line, i, arr) => !(line.trim() === "" && arr[i - 1]?.trim() === ""))
    .join("\n")
    .trim();
}

export function platformSupportsHashtags(platform: Platform) {
  return platform === "Vinted";
}

export function formatDescription(result: AnalysisResult, platform: Platform) {
  const base = stripHashtags(result.description);
  if (platform === "Leboncoin") {
    return `${base}\n\n${LEBONCOIN_MENTION}`;
  }
  return base;
}

export function formatHashtags(result: AnalysisResult, platform: Platform) {
  if (!platformSupportsHashtags(platform)) return "";
  return result.hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ");
}
