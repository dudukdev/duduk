# Routing

<show-structure for="chapter,procedure" depth="3"/>

Duduk uses file based routing. This means that your routes are defined with the file system and special file and folder names.

## Routes

Routes are contained in the `routes` directory inside your `src` directory. The root route (`/`) is defined directly in the `routes` directory. You can create sub-routes with either a static name that does not change, or dynamic routes with a variable name. If you create static routes and a dynamic route on the same level, the dynamic routes acts as a fallback.

### Static Routes

For static routes, i.e. routes with a static name that does not change, create a directory with the name the route should have.

### Dynamic Routes

To create a dynamic routes, create a folder with square brackets around the name. For example `[myRoute]`. The name inside the brackets acts as parameter name. The actual value of the route parts is injected into the layouts and pages. See the specific chapter down below for more information.

## Pages

With pages, you visualize content in the browser to your users. A page can consist of multiple parts. The most important part is the page itself. It includes all content that is unique to a specific page. Layouts can include shared content. For example headers, navigation, or footers. In addition, any page or layout can include code that is executed server-side and can provide data to the page or layout, or can accomplish or tasks like access control.

### Page

#### Page File

A page is written as a [Duduk Component](duduk-components.md). Create a `page.js` or `page.ts` file in the route directory you want. This file has to export a Duduk Component as default export.

<tabs group="script">
<tab title="page.ts" group-key="typescript" id="page.ts">
<code-block lang="typescript">
<![CDATA[
import {html, WebComponent} from "@duduk/components";

export default class extends WebComponent {
    static template = html`Hello, Page!`;
}
]]>
</code-block>
</tab>
<tab title="page.js" group-key="javascript" id="page.js">
<code-block lang="javascript">
<![CDATA[
import {html, WebComponent} from "@duduk/components";

export default class extends WebComponent {
    static template = html`Hello, Page!`;
}
]]>
</code-block>
</tab>
</tabs>

#### Page Server File

To process any data server-side before rendering the page, use a `pageServer.js` or `pageServer.ts` file.

<tabs group="script">
<tab title="pageServer.ts" group-key="typescript" id="pageServer.ts">
<code-block lang="typescript">
<![CDATA[
import type {PageServerDataFunction} from "@duduk/server";

export const data: PageServerDataFunction = async ({request}) => {
    return {title: 'Hello', foo: 'bar', Lorem: 'ipsum'};
}
]]>
</code-block>
</tab>
<tab title="pageServer.js" group-key="javascript" id="pageServer.js">
<code-block lang="javascript">
<![CDATA[
/** @type {import('@duduk/server').PageServerDataFunction} */
export const data = async ({request}) => {
    return {title: 'Hello', foo: 'bar', Lorem: 'ipsum'};
}
]]>
</code-block>
</tab>
</tabs>

The returned data is accessible from within the page component through the `getData()` function. If data is returned from one or more layoutServer data functions also, the data will be merged together.

<tabs group="script">
<tab title="page.ts" group-key="typescript" id="page.ts-getData-example">
<code-block lang="typescript">
<![CDATA[
import {html, WebComponent} from "@duduk/components";
import {getData} from "@duduk/server";

export default class extends WebComponent {
    static template = html`Hello, Page!`;
    constructor() {
        const data = getData<T>();
    }
}
]]>
</code-block>
</tab>
<tab title="page.js" group-key="javascript" id="page.js-getData-example">
<code-block lang="javascript">
<![CDATA[
import {html, WebComponent} from "@duduk/components";
import {getData} from "@duduk/server";

export default class extends WebComponent {
    static template = html`Hello, Page!`;
    constructor() {
        const data = getData();
    }
}
]]>
</code-block>
</tab>
</tabs>

### Layout

#### Layout File

A layout is written as a [Duduk Component](duduk-components.md), like a page. Create a `layout.js` or `layout.ts` file in route directory you want. The file has to export a Duduk Component as default export. The layout is applied to the page in the same directory and every subordinate directory.

The only requirement on a layout component is that the template has to include a `<slot></slot>` element.

<tabs group="script">
<tab title="layout.ts" group-key="typescript" id="layout.ts">
<code-block lang="typescript">
<![CDATA[
import {html, WebComponent} from "@duduk/components";

export default class extends WebComponent {
    static template = html`Hello, Layout! <slot></slot>`;
}
]]>
</code-block>
</tab>
<tab title="layout.js" group-key="javascript" id="layout.js">
<code-block lang="javascript">
<![CDATA[
import {html, WebComponent} from "@duduk/components";

export default class extends WebComponent {
    static template = html`Hello, Layout! <slot></slot>`;
}
]]>
</code-block>
</tab>
</tabs>

#### Layout Server File

To process any data server-side before rendering the layout, use a `layoutServer.js` or `layoutServer.ts` file.

<tabs group="script">
<tab title="layoutServer.ts" group-key="typescript" id="layoutServer.ts">
<code-block lang="typescript">
<![CDATA[
import type {LayoutServerDataFunction} from "@duduk/server";

export const data: LayoutServerDataFunction = async ({request}) => {
    return {title: 'Hello', foo: 'bar', Lorem: 'ipsum'};
}
]]>
</code-block>
</tab>
<tab title="layoutServer.js" group-key="javascript" id="layoutServer.js">
<code-block lang="javascript">
<![CDATA[
/** @type {import('@duduk/server').LayoutServerDataFunction} */
export const data = async ({request}) => {
    return {title: 'Hello', foo: 'bar', Lorem: 'ipsum'};
}
]]>
</code-block>
</tab>
</tabs>

The returned data is accessible from within the page component through the `getData()` function. If data is returned from one or more other layoutServer data functions or pageServer data functions also, the data will be merged together.

<tabs group="script">
<tab title="layout.ts" group-key="typescript" id="layout.ts-getData-example">
<code-block lang="typescript">
<![CDATA[
import {html, WebComponent} from "@duduk/components";
import {getData} from "@duduk/server";

export default class extends WebComponent {
    static template = html`Hello, Layout! <slot></slot>`;
    constructor() {
        const data = getData<T>();
    }
}
]]>
</code-block>
</tab>
<tab title="layout.js" group-key="javascript" id="layout.js-getData-example">
<code-block lang="javascript">
<![CDATA[
import {html, WebComponent} from "@duduk/components";
import {getData} from "@duduk/server";

export default class extends WebComponent {
    static template = html`Hello, Layout! <slot></slot>`;
    constructor() {
        const data = getData();
    }
}
]]>
</code-block>
</tab>
</tabs>

## HTTP Endpoints

HTTP Endpoints are for creating a REST API within your Duduk Server. These endpoints can be called like any other REST endpoint.

There are Page Endpoints and Layout Endpoints. Page Endpoints are defined in the route directory of your choice. Page Endpoints are the endpoint itself. Layout endpoints act like route specific middlewares.

### Page Endpoints

Page endpoints are defined in the `pageServer.js` or `pageServer.ts` file.

<tabs group="script">
<tab title="pageServer.ts" group-key="typescript" id="pageServer.ts-rest">
<code-block lang="typescript">
<![CDATA[
import type {PageServerHttpFunction} from "@duduk/server";

export const GET: PageServerHttpFunction = async ({request, response, data, params}) => {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify({...data, doo: 'ba'}));
}
]]>
</code-block>
</tab>
<tab title="pageServer.js" group-key="javascript" id="pageServer.js-rest">
<code-block lang="javascript">
<![CDATA[
/** @type {import('@duduk/server').PageServerHttpFunction} */
export const GET = async ({request, response, data, params}) => {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify({...data, doo: 'ba'}));
}
]]>
</code-block>
</tab>
</tabs>


### Layout Endpoints

Layout endpoints are defined in a `layoutServer.ts` or `layoutServer.js` file. There cannot be called directly. If a page endpoint is called, the layout endpoint in the same directory as the page endpoint and each higher-level layout endpoint is called before. The returned data are cumulated and injected into the next executed layout or page endpoint.

<tabs group="script">
<tab title="layoutServer.ts" group-key="typescript" id="layoutServer.ts-rest">
<code-block lang="typescript">
<![CDATA[
import type {LayoutServerHttpFunction} from "@duduk/server";

export const GET: LayoutServerHttpFunction = async ({request, data}) => {
    return {title: 'Hello', foo: 'bar', Lorem: 'ipsum'};
}
]]>
</code-block>
</tab>
<tab title="layoutServer.js" group-key="javascript" id="layoutServer.js-rest">
<code-block lang="javascript">
<![CDATA[
/** @type {import('@duduk/server').LayoutServerHttpFunction} */
export const GET = async ({request, data}) => {
    return {title: 'Hello', foo: 'bar', Lorem: 'ipsum'};
}
]]>
</code-block>
</tab>
</tabs>
