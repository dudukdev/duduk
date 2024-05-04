# Getting Started

## Before you start

Before you can create an application with Duduk, you need to make sure that you have installed at least version 20.0.0 of Node.js. You can check your installed version of Node.js with the following command.

```bash
node --version
```

## Create project structure

Follow these steps to create the necessary project structure.

<procedure>
   <step>
      <p>Create a new folder for the project and create a new Node.js project in this folder</p>
      <code-block lang="bash">
         npm init
      </code-block>
   </step>
   <step>
      <p>Install dependencies</p>
      <code-block lang="bash">
         npm install @duduk/components @duduk/server
      </code-block>
   </step>
   <step>
      <p>Add these keys to your `package.json`</p>
      <code-block lang="json" noinject="true">
         "type": "module",
         "scripts": {
            "build:watch": "bundle",
            "serve": "node --experimental-vm-modules --watch-path=./dist dist"
         }
      </code-block>
   </step>
   <step>
      <p>Create folder structure</p>
      <code-block>
         src
            lib
            routes
      </code-block>
   </step>
</procedure>

If you want to use TypeScript, follow the next steps.

<procedure>
   <step>
      <p>Install TypeScript</p>
      <code-block lang="bash">
         npm install -D typescript
      </code-block>
   </step>
   <step>
      <p>Add type check to the `scripts` block in `package.json`</p>
      <code-block lang="json" noinject="true">
         "check": "tsc --noEmit"
      </code-block>
   </step>
   <step>
      <p>Add file `tsconfig.json`</p>
      <code-block lang="json" collapsible="true" collapsed-title="tsconfig.json">
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
      </code-block>
   </step>
</procedure>
