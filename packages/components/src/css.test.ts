import {css} from "./css";
import {expect, test} from "vitest";

test("return correct styles", async () => {
  const styles = css`
    .something {
      color: red;
    }
  `;

  expect(styles instanceof HTMLStyleElement).toBeTruthy();
  expect(styles.textContent).toEqual(`
    .something {
      color: red;
    }
  `);
});

test("return correct styles if it contains variables", async () => {
  const color = 'red';
  const styles = css`
    .something {
      color: ${color};
    }
  `;

  expect(styles instanceof HTMLStyleElement).toBeTruthy();
  expect(styles.textContent).toEqual(`
    .something {
      color: red;
    }
  `);
});

test("return correct styles if 'prependStyles' is set", async () => {
  window.__duduk = {
    prependStyles: '.prependStyles {font-size: 1em}'
  }

  const styles = css`
    .something {
      color: red;
    }
  `;

  expect(styles instanceof HTMLStyleElement).toBeTruthy();
  expect(styles.textContent).toEqual(`.prependStyles {font-size: 1em}

    .something {
      color: red;
    }
  `);
});
