export function matchMimeType(mimeType: string, challenge: string): boolean {
    const mime = mimeType.split(';', 1)[0].trim();

    if (mime === '*/*' || challenge === '*/*') {
        return true;
    }

    const [type, subtype] = mime.split('/');
    const [challengeType, challengeSubtype] = challenge.split('/');

    if (type !== challengeType) {
        return false;
    }

    return subtype === '*' || challengeSubtype === '*' || subtype === challengeSubtype;
}
