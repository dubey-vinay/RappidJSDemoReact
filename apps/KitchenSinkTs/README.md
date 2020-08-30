# Rappid Demo Application - Typescript version

This application showcases the Rappid plugins in action and shows how the plugins
can be combined together. You can use this demo app as a reference for your own application
development.

Application logic is written using the [Typescript][https://www.typescriptlang.org/] while the Rappid is still in JS.

## Running the application

Demo requires `Node.js` and `npm`  

```
npm install
npm start
```

`npm start` runs the Typescript compilation, bundles the result js files and starts the web-server.


Due to Same-Origin policy implemented in the majority of browsers to prevent content from being accessed if the file exists on another domain, it is recommended to access the application through a **Web server**. The application might work only partially when viewed from a file-system location.

