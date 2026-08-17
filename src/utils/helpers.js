import { DEFAULT_DATA } from "../data/defaultData";

export function loadData() {
  try {
    const s = localStorage.getItem("brandx_v4");
    return s ? JSON.parse(s) : JSON.parse(JSON.stringify(DEFAULT_DATA));
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

export async function saveData(d) {
  localStorage.setItem("brandx_v4", JSON.stringify(d));
  try {
    const res = await fetch("/api/save-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d),
    });
    if (res.ok) {
      return true;
    }
  } catch (err) {
    console.warn("Could not save to file system endpoint:", err);
  }
  return false;
}

export function downloadDefaultData(d) {
  const content = `export const DEFAULT_DATA = ${JSON.stringify(d, null, 2)};\n`;
  const blob = new Blob([content], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "defaultData.js";
  a.click();
  URL.revokeObjectURL(url);
}


export function uid() {
  return "_" + Math.random().toString(36).slice(2, 9);
}

export function splitTags(s) {
  return (s || "").split(",").map((x) => x.trim()).filter(Boolean);
}

export function splitLines(s) {
  return (s || "").split("\n").map((x) => x.trim()).filter(Boolean);
}

export function getYTEmbed(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  const v = url.match(/vimeo\.com\/(\d+)/);
  if (v) return `https://player.vimeo.com/video/${v[1]}`;
  return null;
}
