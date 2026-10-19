type StoredImage = {
  buffer: Buffer;
  contentType: string;
  expires: number;
};

const globalStore = globalThis as typeof globalThis & {
  __scanaMedia?: Map<string, StoredImage>;
};

function store() {
  if (!globalStore.__scanaMedia) {
    globalStore.__scanaMedia = new Map();
  }
  return globalStore.__scanaMedia;
}

function prune() {
  const now = Date.now();
  for (const [id, value] of store()) {
    if (value.expires < now) store().delete(id);
  }
}

export function putMedia(buffer: Buffer, contentType: string) {
  prune();
  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  store().set(id, {
    buffer,
    contentType: contentType || "image/jpeg",
    expires: Date.now() + 10 * 60 * 1000,
  });
  return id;
}

export function getMedia(id: string) {
  prune();
  return store().get(id) ?? null;
}
