export type LocaleStrings = Record<string, string | Record<string, string>>;
export type AcceptLocale = string | string[] | readonly string[];

export const data: {
  strings: Record<string, LocaleStrings>;
  locales: Set<string>;
  defaultLocale: string | undefined;
} = {
  strings: {},
  locales: new Set(),
  defaultLocale: undefined
};
