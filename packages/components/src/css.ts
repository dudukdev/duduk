export function css(strings: TemplateStringsArray, ...values: any[]): HTMLStyleElement {
  let result = strings[0];
  for (let i = 1; i < strings.length; i++) {
    result += values[i - 1] + strings[i];
  }
  const styleElement = document.createElement('style');
  if (window.__duduk !== undefined && 'prependStyles' in window.__duduk) {
    result = `${window.__duduk.prependStyles}\n${result}`;
  }
  styleElement.append(result);
  return styleElement;
}
