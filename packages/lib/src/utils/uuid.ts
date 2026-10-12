/**
 * Generates an RFC 9562 UUIDv7 (time-ordered): 48-bit unix timestamp in
 * milliseconds followed by 74 random bits. Time-ordering keeps idempotency
 * keys (and any other generated ids) roughly sortable by creation time,
 * unlike UUIDv4.
 *
 * Randomness comes from `globalThis.crypto.getRandomValues`, which in
 * Node.js is node:crypto's WebCrypto implementation (the same CSPRNG
 * backing `randomBytes`/`randomUUIDv7`) and in browsers is WebCrypto.
 * There is deliberately no `node:crypto` import here: this module ships
 * raw source into `"use client"` bundles, where `node:` imports do not
 * resolve. Byte layout is identical to `randomUUIDv7()` output.
 */
export const uuidv7 = (): string => {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);

  const now = Date.now();
  bytes[0] = Math.floor(now / 2 ** 40) % 256;
  bytes[1] = Math.floor(now / 2 ** 32) % 256;
  bytes[2] = Math.floor(now / 2 ** 24) % 256;
  bytes[3] = Math.floor(now / 2 ** 16) % 256;
  bytes[4] = Math.floor(now / 2 ** 8) % 256;
  bytes[5] = now % 256;
  bytes[6] = (bytes[6]! & 0x0f) | 0x70;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};
