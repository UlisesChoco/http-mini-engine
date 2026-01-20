const fs = require('node:fs');

const apply_variables = (html, variables) => {

}

const load_html = (response, file_path, variables) => {
    let html = fs.readFileSync('../resources/'+file_path, 'utf-8');

    if(variables) {
        variables.forEach((variable) => {
            const key = variable.key;
            const value = variable.value;
            const data = JSON.parse(value);
            
            const regex = new RegExp(`\\$\\{${key}(\\.\\w+)*\\}`);
            let index = html.search(regex);
            while(index !== -1) {
                let lastIndex = index;
                while(lastIndex < html.length || index !== -1) {
                    let char = html.charAt(lastIndex);
                    if(char === '}') {
                        break;
                    }
                    lastIndex += 1;
                }

                const fullKey = html.substring(index+2, lastIndex);
                const keyParts = fullKey.split('.');
                let dataCopy = data;
                for(let i = 0 ; i < keyParts.length; i++) {
                    if(i === 0) {
                        continue;
                    }
                    dataCopy = dataCopy[keyParts[i]];
                }

                html = html.replaceAll(`\${${fullKey}}`, dataCopy);

                index = html.search(regex);
            }
        });
    }

    response.body = html;
};

exports.load_html = load_html;