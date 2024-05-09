export interface HeaderEntry {
  value: string;
  parameters: Record<string, string>;
  weight: number;
  raw: string;
}

export function parseHeader(header: string): HeaderEntry[] {
  const parts = header.split(',').map(p => p.trim()).filter(p => p !== '');
  const result: HeaderEntry[] = [];

  for (const part of parts) {
    let raw = part;
    const elements = part.split(';').map(e => e.trim());
    const value = elements.shift()!;
    let weight = 1;
    if (elements.length >= 1 && elements[elements.length - 1].startsWith('q=')) {
      const q = elements.pop()!;
      const [_, value] = q.split('=').map(e => e.trim());
      weight = Number(value);
      raw = part.substring(0, part.lastIndexOf(';')).trim();
    }

    const parameters: Record<string, string> = {};
    for (const element of elements) {
      const [key, value] = element.split('=').map(e => e.trim());
      parameters[key] = value;
    }
    result.push({value, parameters, weight, raw});
  }

  return result.sort((a, b) => a.weight === b.weight ? 0 : a.weight > b.weight ? -1 : 1);
}
