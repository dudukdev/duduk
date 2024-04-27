export function css(strings: TemplateStringsArray, ...values: any[]): HTMLStyleElement {
    let result = strings[0];
    for (let i = 1; i < strings.length; i++) {
        result += strings[i] + values[i - 1];
    }
    const styleElement = document.createElement('style');
    if (window.__app !== undefined && 'prependStyles' in window.__app) {
        result = `${window.__app.prependStyles}\n${result}`;
    }
    styleElement.append(result);
    return styleElement;
}