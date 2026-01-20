const Net = require('node:net');

const server_log = (log) => {
    console.log('[SERVER]: '+log);
}

const populate_request = (request, data) => {
    const data_str = data.toString('utf-8');

    const index = data_str.indexOf('\r\n');

    const header_request = data_str.slice(0, index);

    const parts = header_request.split(' ');

    request.method = parts[0];
    request.route = parts[1];
    request.http_version = parts[2];

    server_log('Request received:\n'+JSON.stringify(request));
}

const populate_response = (response) => {
    if(!response.body) response.body = '';

    const buffer = Buffer.from(response.body, 'utf-8');

    response.http_headers = 'HTTP/1.1 200 OK\r\nContent-Length: '+buffer.length+'\r\nContent-Type: text/html\r\n\r\n';
}

const populate_404_response = (response) => {
    response.body = `<html><body><h1>404 Not Found</h1></body></html>`;

    const buffer = Buffer.from(response.body, 'utf-8');

    response.http_headers = 'HTTP/1.1 404 Not Found\r\nContent-Length: '+buffer.length+'\r\nContent-Type: text/html\r\n\r\n';
}

const start = (port, controller) => {
    const net_server = Net.createServer((client) => {
        server_log('Connection received from '+client.remoteAddress+':'+client.remotePort);

        client.on('data', async (data) => {
            const request = {};
            const response = {};

            populate_request(request, data);

            if(request.method !== 'GET') {
                server_log('Unsupported method: '+request.method);
                return;
            }

            if(request.method == 'GET') {
                if(!controller.GET.has(request.route)) {
                    populate_404_response(response);
                } else {
                    const { route, handler } = controller.GET.get(request.route);
                    await handler(request, response);
                    populate_response(response);
                }
            }

            client.write(''+response.http_headers+response.body);
        });
    });
    net_server.listen(port, () => {
        server_log('Listening on port '+port);
    });
};

exports.start = start;