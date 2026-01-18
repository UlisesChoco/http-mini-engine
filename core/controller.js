const controller = {
    GET: new Map(),
    get: (route, handler) => {
        controller.GET.set(route, { route, handler });
    }
};

exports.controller = controller;