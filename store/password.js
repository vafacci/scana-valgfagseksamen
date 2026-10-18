export async function hashPassword(password) {
  const payload = `scana-v1:${String(password || '')}`;

  if (typeof globalThis.crypto?.subtle?.digest === 'function') {
    const data = new TextEncoder().encode(payload);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  let hash = 5381;
  for (let i = 0; i < payload.length; i += 1) {
    hash = (hash * 33) ^ payload.charCodeAt(i);
  }
  return `fb_${(hash >>> 0).toString(16)}`;
}

export function publicUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}
