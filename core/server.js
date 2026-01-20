const Net = require('node:net');
const Http = require('./http');

const start = (port, controller) => {
    const net_server = Net.createServer((client) => {
        Http.server_log('Connection received from '+client.remoteAddress+':'+client.remotePort);

        client.on('data', async (data) => {
            const request = {};
            const response = {};

            Http.populate_request(request, data);

            await Http.resolve_request(request, response, controller);            
            
            client.write(''+response.http_headers+response.body);
        });
    });
    net_server.listen(port, () => {
        Http.server_log('Listening on port '+port);
    });
};

exports.start = start;