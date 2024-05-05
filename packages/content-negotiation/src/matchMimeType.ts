export function matchMimeType(mimeType: string, check: string): boolean {
    const mime = mimeType.split(';', 1)[0].trim();

    if (mime === '*/*' || check === '*/*') {
        return true;
    }

    const [type, subtype] = mime.split('/');
    const [challengeType, challengeSubtype] = check.split('/');

    if (type !== challengeType) {
        return false;
    }

    return subtype === '*' || challengeSubtype === '*' || subtype === challengeSubtype;
}
