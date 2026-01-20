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
- **Async handlers**: Controllers support asynchronous functions with Promise-based execution
- **Template engine**: Load HTML files with nested object property substitution (`${data.user.name}`)
- **404 responses**: Automatic handling of unknown routes

## Installation

```bash
# Clone the repository
git clone https://github.com/UlisesChoco/http-server.git

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

Handlers support async/await for asynchronous operations:

```javascript
controller.get('/', async (request, response) => {
    const userData = await fetchUserData(); // Example async operation
    
    load_html(
        response,
        'my-page.html',
        [
            { key: 'data', value: JSON.stringify({
                title: 'My Title',
                user: {
                    fullName: userData.name,
                    email: userData.email
                }
            })}
        ]
    );
});
```

### 3. Create HTML template

Access nested object properties using dot notation:

```html
<!-- resources/my-page.html -->
<h1>${data.title}</h1>
<p>Welcome, ${data.user.fullName}</p>
<p>Email: ${data.user.email}</p>
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
Registers a GET route. Supports async handlers.

| Parameter | Type | Description |
|-----------|------|-------------|
| `route` | string | Route to register (e.g., `/`, `/users`) |
| `handler` | function | Function `(request, response) => {}` or `async (request, response) => {}` |

### `load_html(response, file_path, variables)`
Loads an HTML file and substitutes variables. Supports nested object properties.

| Parameter | Type | Description |
|-----------|------|-------------|
| `response` | object | Response object from the handler |
| `file_path` | string | Relative path to the HTML file from `/resources` |
| `variables` | array | Array of `{ key, value }` objects where `value` is a JSON stringified object |

**Variable substitution example:**

```javascript
// In controller
{ key: 'user', value: JSON.stringify({ name: 'John', address: { city: 'NYC' } }) }

// In HTML template
<p>${user.name}</p>           // Output: John
<p>${user.address.city}</p>   // Output: NYC
```

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
