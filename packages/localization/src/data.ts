export type LocaleStrings = Record<string, string | Record<string, string>>;
export type AcceptLocale = string | string[] | readonly string[];

export const data: {
  strings: Map<string, LocaleStrings>;
  defaultLocale: string | undefined;
} = {
  strings: new Map(),
  defaultLocale: undefined
};
