# HTTP Server

A minimal HTTP server built from scratch using Node.js with support for dynamic HTML templates.

## Project Structure

```
├── core/                    # HTTP server engine
│   ├── server.js            # TCP server with HTTP request parsing
│   ├── controller.js        # Routing system
│   ├── file_reader.js       # HTML template loader with variable substitution
│   └── package.json
│
└── app/                     # Example application
    ├── src/
    │   └── application.js   # Route configuration and server startup
    └── resources/
        ├── index.html       # Main page template
        └── test.html        # Test page template
```

## Features

- **Native TCP server**: Built with `node:net`, no external dependencies
- **HTTP parsing**: Support for GET requests
- **Routing system**: Register handlers through a controller
- **Template engine**: Load HTML files with `${variable}` substitution
- **404 responses**: Automatic handling of unknown routes

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/http-server.git

# Enter the directory
cd http-server
```

## Usage

### Run the example application

```bash
cd app/src
node application.js
```

The server will start at `http://localhost:8080`

### Available routes in the example

| Route | Description |
|-------|-------------|
| `/` | Main page |
| `/test` | Test page with dynamic message |

## How to Use the Engine (core)

### 1. Import the modules

```javascript
const server = require('../../core/server');
const { controller } = require('../../core/controller');
const { load_html } = require('../../core/file_reader');
```

### 2. Define routes

```javascript
controller.get('/', (request, response) => {
    load_html(
        response,
        'my-page.html',
        [
            { key: 'title', value: 'My Title' },
            { key: 'message', value: 'Hello World!' }
        ]
    );
});
```

### 3. Create HTML template

```html
<!-- resources/my-page.html -->
<h1>${title}</h1>
<p>${message}</p>
```

### 4. Start the server

```javascript
server.start(8080, controller);
```

## API Reference

### `server.start(port, controller)`
Starts the HTTP server on the specified port.

| Parameter | Type | Description |
|-----------|------|-------------|
| `port` | number | Port where the server will listen |
| `controller` | object | Controller instance with registered routes |

### `controller.get(route, handler)`
Registers a GET route.

| Parameter | Type | Description |
|-----------|------|-------------|
| `route` | string | Route to register (e.g., `/`, `/users`) |
| `handler` | function | Function `(request, response) => {}` |

### `load_html(response, file_path, variables)`
Loads an HTML file and substitutes variables.

| Parameter | Type | Description |
|-----------|------|-------------|
| `response` | object | Response object from the handler |
| `file_path` | string | Relative path to the HTML file from `/resources` |
| `variables` | array | Array of `{ key, value }` objects to substitute in the HTML |

## Request and Response Objects

### Request
```javascript
{
    method: 'GET',
    route: '/test',
    http_version: 'HTTP/1.1'
}
```

### Response
```javascript
{
    body: '<html>...</html>',
    http_headers: 'HTTP/1.1 200 OK\r\n...'
}
```

## Technologies

- Node.js
- Native `node:net` module for TCP
- Native `node:fs` module for file reading
