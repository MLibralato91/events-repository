// Firma/verifica sessioni admin con HMAC-SHA256 (Web Crypto, compatibile Edge + Node).

const encoder = new TextEncoder();

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualHex(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 giorni

export async function createSessionToken(secret: string) {
  const exp = Date.now() + SESSION_TTL_MS;
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(String(exp)));
  return `${exp}.${toHex(sig)}`;
}

export async function verifySessionToken(token: string | undefined, secret: string) {
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const key = await hmacKey(secret);
  const expectedSig = await crypto.subtle.sign("HMAC", key, encoder.encode(expStr));
  return timingSafeEqualHex(toHex(expectedSig), sig);
}

// Confronto a tempo costante tra password inserita e quella in env (via digest SHA-256).
export async function safeCompare(a: string, b: string) {
  const [digestA, digestB] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  return timingSafeEqualHex(toHex(digestA), toHex(digestB));
}
