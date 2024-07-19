export function parseCookies(cookies: string): Map<string, string> {
  const cookieMap = new Map<string, string>();
  if (cookies !== '') {
    const cookieParts = cookies.split(';');
    for (const cookiePart of cookieParts) {
      const equalSignIndex = cookiePart.indexOf('=');

      const key = cookiePart.substring(0, equalSignIndex).trim();
      const value = cookiePart.substring(equalSignIndex + 1).trim();
      cookieMap.set(key, value);
    }
  }
  return cookieMap;
}
