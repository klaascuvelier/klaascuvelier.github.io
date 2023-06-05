const crypto = require( 'crypto');
const fs = require( 'fs');

const config = new Map([['css/main.css', new Set(['index.html'])]]);

config.forEach((value, key) => {
    const hash = getHash(`_site/${key}`);
    fs.copyFileSync(`_site/${key}`, `_site/${key.replace(/\.(\w+)$/, `.${hash}.$1`)}`);
    
    value.forEach(file => {
        const newContent = fs.readFileSync(`_site/${file}`, 'utf8').replace(key, key.replace(/\.(\w+)$/, `.${hash}.$1`));
        fs.writeFileSync(`_site/${file}`, newContent);
    });
});

function getHash(filePath) {
    return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex').slice(0, 10);
}