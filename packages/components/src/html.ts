export function html(strings: TemplateStringsArray, ...values: any[]): DocumentFragment {
  let result = strings[0];
  for (let i = 1; i < strings.length; i++) {
    result += values[i - 1] + strings[i];
  }
  const template = document.createElement('template');
  template.innerHTML = result;
  return template.content;
}
