# Routing

<show-structure for="chapter,procedure" depth="2"/>

Duduk uses file based routing. This means that your routes are defined with the file system and special file and folder names.

## Routes

Routes are contained in the `routes` directory inside your `src` directory. The root route (`/`) is defined directly in the `routes` directory. You can create sub-routes with either a static name that does not change, or dynamic routes with a variable name. If you create static routes and a dynamic route on the same level, the dynamic routes acts as a fallback.

### Static Routes

For static routes, i.e. routes with a static name that does not change, create a directory with the name the route should have.

### Dynamic Routes

To create a dynamic routes, create a folder with square brackets around the name. For example `[myRoute]`. The name inside the brackets acts as parameter name. The actual value of the route parts is injected into the layouts and pages. See the specific chapter down below for more information.

## Pages

### Page

### Layout

## HTTP Endpoints

### Page Endpoints

### Layout Endpoints
