import {expect, test} from "vitest";
import {parseCookies} from "./parse";

test('parse cookie header', () => {
  const cookieHeader = 'OGP=-19031779:; NID=515=YQ2cr7AnKSBqyons-OjKIiJqF1I9mHY86g8XpNP673AXTS5_0CjRRQ89PW8NYOp6av; OGPC=19031779-1:; __Secure-ENID=21.SE=y5_0HbjAcWfugOb1UMd44ZNAu; APISID=x-Bsp_2cPEByHXQV/A9kyJnbea-oASPcrB; CONSENT=PENDING+040; NID=ASDF';
  const result = parseCookies(cookieHeader);
  expect(result).toEqual(new Map<string, string>([
    ['OGP', '-19031779:'],
    ['NID', 'ASDF'],
    ['OGPC', '19031779-1:'],
    ['__Secure-ENID', '21.SE=y5_0HbjAcWfugOb1UMd44ZNAu'],
    ['APISID', 'x-Bsp_2cPEByHXQV/A9kyJnbea-oASPcrB'],
    ['CONSENT', 'PENDING+040']
  ]));
});
