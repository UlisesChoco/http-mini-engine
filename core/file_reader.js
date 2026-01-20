const fs = require('node:fs');

const serch_variable_value = (html, data, index, lastIndex) => {
    const fullKey = html.substring(index+2, lastIndex);
    const keyParts = fullKey.split('.');
    let dataCopy = data;
    for(let i = 0 ; i < keyParts.length; i++) {
        if(i === 0) {
            continue;
        }
        dataCopy = dataCopy[keyParts[i]];
    }
    
    return { fullKey, dataCopy };
}

const search_variable_last_index = (html, index) => {
    let lastIndex = index;
    while(lastIndex < html.length || index !== -1) {
        let char = html.charAt(lastIndex);
        if(char === '}') {
            break;
        }
        lastIndex += 1;
    }
    return lastIndex;
}

const apply_variables = (html, data, key) => {
    const regex = new RegExp(`\\$\\{${key}(\\.\\w+)*\\}`);
    let index = html.search(regex);
    while(index !== -1) {
        const lastIndex = search_variable_last_index(html, index);

        const { fullKey, dataCopy } = serch_variable_value(html, data, index, lastIndex);

        html = html.replaceAll(`\${${fullKey}}`, dataCopy);

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

exports.load_html = load_html;