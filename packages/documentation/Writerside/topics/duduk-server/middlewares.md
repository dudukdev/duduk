# Middlewares

Middlewares are pieces of code that are execute at the start and at the end of every page or HTTP request. Middlewares are stored in a `setupServer.js` or `setupServer.ts` file in your `src` directory.

<tabs group="script">
<tab title="setupServer.ts" group-key="typescript" id="setupServer.ts">
<code-block lang="typescript">
<![CDATA[
import type {[[[Middlewares|server-types.md#middlewares]]]} from "@duduk/server";

export const middlewares: Middlewares = [
    async ({event, resolve, response}}) => {
        // code at start
        const resolvedResponse = await resolve(event);
        // code at end
        return resolvedResponse;
    }
];
]]>
</code-block>
</tab>
<tab title="setupServer.js" group-key="javascript" id="setupServer.js">
<code-block lang="javascript">
<![CDATA[
/** @type {import('@duduk/server').[[[Middlewares|server-types.md#middlewares]]]} */
export const middlewares = [
    async ({event, resolve, response}}) => {
        // code at start
        const resolvedResponse = await resolve(event);
        // code at end
        return resolvedResponse;
    }
];
]]>
</code-block>
</tab>
</tabs>

Any middleware has to call the `resolve()` function in order to continue the request chain. If you want to abort the request chain for some reason, do not call `resolve()` but return the `response` object from the parameters. Do not use this `response` object for other purposes.
