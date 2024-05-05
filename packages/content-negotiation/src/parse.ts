export interface HeaderEntry {
  value: string;
  parameters: Record<string, string>;
  weight: number
}

export function parseHeader(header: string): HeaderEntry[] {
    const parts = header.split(',').map(p => p.trim()).filter(p => p !== '');
    const result: HeaderEntry[] = [];

    for (const part of parts) {
        const elements = part.split(';').map(e => e.trim());
        const value = elements.shift()!;
        let weight = 1;
        const parameters: Record<string, string> = {};
        for (const element of elements) {
            const [key, value] = element.split('=').map(e => e.trim());
            if (key === 'q') {
                weight = Number(value);
            } else {
                parameters[key] = value;
            }
        }
        result.push({value, parameters, weight});
    }

    return result.sort((a, b) => a.weight === b.weight ? 0 : a.weight > b.weight ? -1 : 1);
}
