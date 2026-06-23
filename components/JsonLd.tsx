/**
 * Renders a JSON-LD structured-data block. Server-safe; the object is
 * serialised at render time. Kept minimal — no third-party schema lib.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Escape "<" so a stray "</script>" in any string can't break out of the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
