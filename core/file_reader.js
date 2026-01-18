const fs = require('node:fs');

const load_html = (response, file_path, variables) => {
    let html = fs.readFileSync('../resources/'+file_path, 'utf-8');

    if(variables) {
        variables.forEach((variable) => {
            const key = variable.key;
            const value = variable.value;
            html = html.replaceAll(`\${${key}}`, value);
        });
    }

    response.body = html;
};

exports.load_html = load_html;