const SENSITIVE_KEYS = new Set(['password', 'passwordHash', 'sessionSecret', 'cookie', 'authorization']);

export function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redact);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        SENSITIVE_KEYS.has(key) ? '[redacted]' : redact(nested),
      ]),
    );
  }

  return value;
}
