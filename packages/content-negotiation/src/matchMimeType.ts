import mime from "mime";

export function matchMimeType(requestMimeType: string, checkMimeType: string, strict: boolean = true): boolean {
  if (requestMimeType === checkMimeType) {
    return true;
  }

  const request = splitMimeFromParams(requestMimeType);
  const check = splitMimeFromParams(checkMimeType);

  if (
    (!strict && (request.mime === '*/*' || check.mime === '*/*') && (request.params === check.params || request.params === undefined || check.params === undefined)) ||
    (strict && (request.mime === '*/*' && (request.params === undefined || request.params === check.params)))
  )
  {
    return true;
  } else if (strict && request.mime === '*/*' && request.params !== check.params) {
    return false;
  }

  const [requestType, requestSubtype] = request.mime.split('/');
  const [checkType, checkSubtype] = check.mime.split('/');

  if (requestType !== checkType) {
    return false;
  }

  return (!strict && (request.params === check.params || request.params === undefined || check.params === undefined) &&
                     (requestSubtype === '*' || checkSubtype === '*' || requestSubtype === checkSubtype)) ||
         (strict && ((requestSubtype === '*' && (request.params === undefined || request.params === check.params)) ||
                    (requestSubtype === checkSubtype && request.params === undefined)));
}

export function splitMimeFromParams(mimeType: string ): {mime: string; params: string | undefined} {
  const paramSeparator = mimeType.indexOf(';');
  let mime: string;
  let params: string | undefined = undefined;
  if (paramSeparator === -1) {
    mime = mimeType;
  } else {
    mime = mimeType.substring(0, paramSeparator);
    params = mimeType.substring(paramSeparator + 1);
    if (params.trim() === '') {
      params = undefined;
    }
  }
  return {mime, params};
}
