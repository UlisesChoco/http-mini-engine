const server = require('../../core/server');
const { controller } = require('../../core/controller');
const { load_html } = require('../../core/file_reader');

controller.get('/', (request, response) => {
    load_html(
        response,
        'index.html',
        [
            { key: 'route', value: request.route },
        ]
    );
});

controller.get('/test', (request, response) => {
    load_html(
        response,
        'test.html',
        [
            { key: 'route', value: request.route },
            { key: 'message', value: 'hello from controller ! :3' }
        ]
    );
});

server.start(8080, controller);