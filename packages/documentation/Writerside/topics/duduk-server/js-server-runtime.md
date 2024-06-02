# JavaScript Server Runtime

Currently, Duduk Server only supports Node.js as server runtime environment. Neither Deno, nor Bun, nor Winter JS are supported. This is because Duduk Server depends on specific Node.js features, that are currently not supported in the other runtime environments. Below is a table of the used Node.js packages.

| Package                                                                                                      | Node.js ✅ | Deno ❌ | Bun ❌ | Winter JS ❌ |
|--------------------------------------------------------------------------------------------------------------|-----------|--------|-------|-------------|
| **node:fs**<br/>.rmSync<br/>.mkdirSync<br/>.existsSync<br/>.statSync<br/>.createReadStream<br/>.readFileSync | ✅         | ✅      | ✅     | ❓           |
| **node:fs/promises**<br/>.readdir<br/>.lstat<br/>.readFile                                                   | ✅         | ✅      | ✅     | ❓           |
| **node:path**<br/>.normalize<br/>.join<br/>.relative<br/>.dirname                                            | ✅         | ✅      | ✅     | ❓           |
| **node:http**<br/>.createServer                                                                              | ✅         | ✅      | ✅     | ❓           |
| **node:vm**<br/>.createContext<br/>.SourceTextModule<br/>.ModuleLinker                                       | ✅         | ❌      | ❌     | ❓           |
| **node:crypto**<br/>.createHash                                                                              | ✅         | ✅      | ✅     | ❓           |

Winter JS does not provide a compatibility overview, therefore compatibility for Winter JS cannot be checked.
