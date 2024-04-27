import {parseHeader} from "./parse";
import {matchMimeType} from "./matchMimeType";

export function matchAcceptHeader(acceptHeader: string, toCheck: string[]): string | undefined {
    const entries = parseHeader(acceptHeader);
    entries.sort((a, b) => {
        if (a.weight === b.weight) {
            const [aMime, aParameter] = a.value.split(';').map(v => v.trim());
            const [bMime, bParameter] = b.value.split(';').map(v => v.trim());

            if (aMime === bMime) {
                return aParameter === bParameter ? 0 : aParameter === undefined ? 1 : -1;
            }

            const [aType, aSubType] = aMime.split('/');
            const [bType, bSubType] = bMime.split('/');
        } else {
            return a.weight > b.weight ? -1 : 1;
        }
    });

    for (const check of toCheck) {
        for (const entry of entries) {
            if (matchMimeType(entry.value, check)) {
                return check;
            }
        }
    }

    return undefined;
}
