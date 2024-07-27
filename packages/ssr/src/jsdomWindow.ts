import type {DOMWindow, JSDOM} from "jsdom";

export function setupJSDOMWindow(jsdom: JSDOM): void {
  const origWindow = jsdom.window;

  Object.defineProperty(jsdom, 'window', {
    get: () => new Proxy(origWindow, {
      get(target, prop, receiver) {
        switch (prop) {
          case 'window':
            return jsdom.window;
          case 'location':
            return {
              ...origWindow.location,
              href: origWindow.location.href,
              toString: () => origWindow.location.href,
              assign: () => {},
              replace: () => {},
              reload: () => {}
            } satisfies Location;
          default:
            return Reflect.get(target, prop, receiver);
        }
      },
      set(target: DOMWindow, prop: string | symbol, newValue: any, receiver: any): boolean {
        if (prop === 'location') {
          return true;
        }
        return Reflect.set(target, prop, newValue, receiver);
      }
    })
  });
}
