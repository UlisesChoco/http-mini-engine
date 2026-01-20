const fs = require('node:fs');

const serch_variable_value = (html, data, index, last_index) => {
    const full_key = html.substring(index+2, last_index);
    const key_parts = full_key.split('.');
    let data_copy = data;
    for(let i = 0 ; i < key_parts.length; i++) {
        if(i === 0) {
            continue;
        }
        data_copy = data_copy[key_parts[i]];
    }
    
    return { full_key, data_copy };
}

const search_variable_last_index = (html, index) => {
    let last_index = index;
    while(last_index < html.length || index !== -1) {
        let char = html.charAt(last_index);
        if(char === '}') {
            break;
        }
        last_index += 1;
    }
    return last_index;
}

const apply_variables = (html, data, key) => {
    const regex = new RegExp(`\\$\\{${key}(\\.\\w+)*\\}`);
    let index = html.search(regex);
    while(index !== -1) {
        const last_index = search_variable_last_index(html, index);
        const { full_key, data_copy } = serch_variable_value(html, data, index, last_index);

        html = html.replaceAll(`\${${full_key}}`, data_copy);

        index = html.search(regex);
    }
    return html;
}

const load_html = (response, file_path, variables) => {
    let html = fs.readFileSync('../resources/'+file_path, 'utf-8');

    if(variables) {
        variables.forEach((variable) => {
            const data = JSON.parse(variable.value);
            html = apply_variables(html, data, variable.key);
        });
    }

    response.body = html;
};

const load_static = (response, file_path) => {
    let css = fs.readFileSync('../resources/'+file_path, 'utf-8');

    response.body = css;
}

exports.load_html = load_html;
exports.load_static = load_static;