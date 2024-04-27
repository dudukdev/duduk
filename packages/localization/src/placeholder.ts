export function applyPlaceholder(templateString: string, values: Record<string, string>): string {
  for (const [key, value] of Object.entries(values)) {
    templateString = templateString.replace(`{${key}}`, value);
  }
  return templateString;
}
