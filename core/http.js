const { load_static } = require('./file_reader');

const MIME_TYPE = {
    '.html': 'text/html;',
    '.css': 'text/css;'
}

const HEADER_RESPONSE = {
    '200': 'HTTP/1.1 200 OK',
    '404': 'HTTP/1.1 404 Not Found'
}

const GENERAL_HEADERS = {
    'content': 'Content-Type: ',
    'length': 'Content-Length: '
}

//this has no reason to be in a http file but anyways qwq
const server_log = (log) => {
    console.log('[SERVER]: '+log);
}

const split_request = (data) => {
    const data_str = data.toString('utf-8');

    const index = data_str.indexOf('\r\n');

    const header_request = data_str.slice(0, index);

    return header_request.split(' ');
}

const populate_request = (request, data) => {
    const parts = split_request(data);

    request.method = parts[0];
    request.route = parts[1];
    request.http_version = parts[2];

    server_log('Request received:\n'+JSON.stringify(request));
}

const build_200_response = (buffer_length, content_type) => {
    return `${HEADER_RESPONSE['200']}\r\n${GENERAL_HEADERS['length']}${buffer_length}\r\n${GENERAL_HEADERS['content']}${content_type} charset=utf-8\r\n\r\n`;
}

const populate_response = (response, content_type = MIME_TYPE['.html']) => {
    if(!response.body) response.body = '';

    const buffer = Buffer.from(response.body, 'utf-8');

    response.http_headers = build_200_response(buffer.length, content_type);
}

const build_404_response = (buffer_length) => {
    return `${HEADER_RESPONSE['404']}\r\n${GENERAL_HEADERS['length']}${buffer_length}\r\n${GENERAL_HEADERS['content']}${MIME_TYPE['.html']} charset=utf-8\r\n\r\n`;
}

const populate_404_response = (response) => {
    response.body = `<html><body><h1>404 Not Found</h1></body></html>`;

    const buffer = Buffer.from(response.body, 'utf-8');

    response.http_headers = build_404_response(buffer.length);
}

const resolve_static_request = (request, response) => {
    const file_path = request.route.substring(1);

    load_static(response, file_path);

    populate_response(response, MIME_TYPE['.css']);
}

const resolve_html_request = async (request, response, controller) => {
    if(request.method == 'GET') {
        if(!controller.GET.has(request.route)) {
            populate_404_response(response);
            return;
        }

        const { route, handler } = controller.GET.get(request.route);
        
        await handler(request, response);

        populate_response(response, MIME_TYPE['.html']);
    }
}

const resolve_request = async (request, response, controller) => {
    if(request.method !== 'GET') {
        server_log('Unsupported method: '+request.method);
        return;
    }

    if(request.route.endsWith('.css')) {
        resolve_static_request(request, response);
        return;
    }

    //for now we assume its a html req d:
    await resolve_html_request(request, response, controller);
}

exports.server_log = server_log;
exports.populate_request = populate_request;
exports.resolve_request = resolve_request;