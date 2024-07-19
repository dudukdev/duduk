export interface Cookie {
  key: string;
  value: string;

  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  partitioned?: boolean;
  path?: string;
  priority?: 'Low' | 'Medium' | 'High'
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None',
}

export function createSetCookieHeader(cookie: Cookie): string {
  if (!isValidCookieKey(cookie.key)) {
    throw new Error('Cookie key contains invalid characters');
  }
  if (!isValidCookieValue(cookie.value)) {
    throw new Error('Cookie value contains invalid characters');
  }

  const parts: string[] = [`${cookie.key}=${cookie.value}`];

  if (cookie.domain !== undefined) parts.push(`Domain=${cookie.domain}`);
  if (cookie.expires !== undefined) parts.push(`Expires=${cookie.expires.toUTCString()}`);
  if (cookie.httpOnly !== undefined && cookie.httpOnly) parts.push('HttpOnly');
  if (cookie.maxAge !== undefined) parts.push(`Max-Age=${cookie.maxAge}`);
  if (cookie.partitioned !== undefined && cookie.partitioned) parts.push('Partitioned');
  if (cookie.path !== undefined) parts.push(`Path=${cookie.path}`);
  if (cookie.sameSite !== undefined) parts.push(`SameSite=${cookie.sameSite}`);
  if (cookie.secure !== undefined && cookie.secure) parts.push('Secure');

  return parts.join('; ');
}

function isValidCookieKey(key: string): boolean {
  return /^[a-zA-Z0-9\-_.]+$/u.test(key);
}

function isValidCookieValue(value: string): boolean {
  return /^[^;,\s]+$/u.test(value);
}
