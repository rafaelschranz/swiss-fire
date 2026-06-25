import { DEFAULT_INPUTS, type CalculatorInputs } from "@/lib/inputs";
import type { EstimableKey } from "@/lib/estimates";

/**
 * Bookmarkable scenarios. The full input state is encoded into the URL hash
 * (base64url of JSON) — entirely client-side, so no financial figures are ever
 * sent to a server, consistent with the privacy model. Decoding is defensive:
 * it merges over DEFAULT_INPUTS so links survive added fields.
 */
const HASH_PREFIX = "#s=";
const VERSION = 1;

interface ShareEnvelope {
  v: number;
  i: CalculatorInputs;
  a: EstimableKey[];
}

function toBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Serialises inputs + auto-estimate flags into a URL-hash fragment (incl. the `#s=` prefix). */
export function encodeShareHash(inputs: CalculatorInputs, autoKeys: ReadonlySet<EstimableKey>): string {
  const envelope: ShareEnvelope = { v: VERSION, i: inputs, a: [...autoKeys] };
  return HASH_PREFIX + toBase64Url(JSON.stringify(envelope));
}

/**
 * Parses a URL hash back into inputs + auto-keys, or null if it is absent or
 * malformed. Unknown/missing fields fall back to the defaults.
 */
export function decodeShareHash(hash: string): { inputs: CalculatorInputs; autoKeys: EstimableKey[] } | null {
  if (!hash || !hash.startsWith(HASH_PREFIX)) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(hash.slice(HASH_PREFIX.length))) as Partial<ShareEnvelope>;
    if (!parsed || typeof parsed !== "object" || !parsed.i) return null;
    const i = parsed.i as Partial<CalculatorInputs>;
    const inputs: CalculatorInputs = {
      ...DEFAULT_INPUTS,
      ...i,
      partner: { ...DEFAULT_INPUTS.partner, ...(i.partner ?? {}) },
    };
    const autoKeys = Array.isArray(parsed.a) ? (parsed.a as EstimableKey[]) : [];
    return { inputs, autoKeys };
  } catch {
    return null;
  }
}
