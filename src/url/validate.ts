const ALLOWED_SCHEMES = new Set(["http:", "https:"]);

export function findUrlProblem(text: string): string | null {
  const link = text.trim();
  if (link === "") return "Type a link first";

  let parsed: URL;
  try {
    parsed = new URL(link);
  } catch {
    return "Hmm, that's not a link yet";
  }

  if (!ALLOWED_SCHEMES.has(parsed.protocol)) {
    return `Only http and https please (you used ${parsed.protocol})`;
  }


  const parts = parsed.hostname.split(".");
  const ending = parts[parts.length - 1];
  if (parts.length < 2 || parts.includes("") || ending.length < 2) {
    return "The domain is not complete yet";
  }

  return null;
}
