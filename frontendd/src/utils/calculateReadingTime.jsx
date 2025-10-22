// calculateReadingTime.jsx
export default function calculateReadingTime(text) {
  // handle null/undefined/non-string safely
  if (!text || typeof text !== "string") return "0 min read";

  // remove HTML tags if content might be HTML
  const plain = text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return "0 min read";

  const words = plain.split(" ").length;
  const wordsPerMinute = 200; // adjust if you want faster/slower estimate
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes} min read`;
}
