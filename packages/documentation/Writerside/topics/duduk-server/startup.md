# Startup

## Server Startup

You can execute code on the server on startup of the webserver. For example, you can initialize database connections or execute other setup code. Create a `setupServer.js` or `setupServer.ts` file in the `src` directory of your project. This file is executed right after the webserver has been started.

## Client Startup

In the browser you can execute code on page load right before all other Duduk logic is executed. Create a `setupClient.js` or `setupClient.ts` file in the `src` directory of your project.
