const fs = require('fs');
const path = require('path');

function walk(dir, out) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p, out);
        else if (/\.test\.(ts|tsx)$/.test(e.name) && p.includes('__tests__')) out.push(p);
    }
}

const files = [];
walk('src', files);

let edits = 0;
for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    const next = src.replace(
        /(from\s+["']|require\(\s*["']|jest\.mock\(\s*["'])(\.\.?\/)/g,
        (_m, prefix, dots) => {
            if (dots === './') return prefix + '../';
            return prefix + '../../';
        }
    );
    if (next !== src) {
        fs.writeFileSync(file, next);
        edits++;
        console.log('patched', file);
    }
}
console.log('Total patched:', edits);
