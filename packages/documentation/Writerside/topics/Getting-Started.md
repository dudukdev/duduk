# Getting Started

## Before you start

Before you can create an application with this framework, you need to make sure that you have installed at least version 20.0.0 of Node.js. You can check your installed version of Node.js with the following command.

```bash
node --version
```

## Create project structure

Follow these steps to create the necessary project structure.

1. Create a new folder for the project and create a new Node.js project in this folder

   ```bash
   npm init
   ```

2. Install dependencies

   ```bash
   npm install @framework/components @framework/server
   ```

3. Add these keys to your `package.json`

   ```yaml
   "type": "module",
   "scripts": {
     "build:watch": "bundle",
     "serve": "node --experimental-vm-modules --watch-path=./dist dist"
   }
   ```
   
4. Create folder structure

   ```
   src
     lib
     routes
   ```
   
5. If you want to use TypeScript, follow these steps

   1. Install TypeScript

      ```bash
      npm install -D typescript
      ```

   2. Add type check to the `scripts` block in `package.json`

      ```yaml
      "check": "tsc --noEmit"
      ```
   
   3. Add file `tsconfig.json`

      ```json
      {
        "compilerOptions": {
          "target": "ES2020",
          "module": "ES2020",
          "moduleResolution": "Node10",
          "paths": {
            "$lib": ["./src/lib"],
            "$lib/*": ["./src/lib/*"],
            "$locale/*": ["./src/locale/*"]
          },
          "resolveJsonModule": true,
          "esModuleInterop": true,
          "forceConsistentCasingInFileNames": true,
          "strict": true,
          "skipLibCheck": true
        },
        "include": [
          "src/**/*.ts"
        ]
      }
      ```
      {collapsible="true" collapsed-title="tsconfig.json"}