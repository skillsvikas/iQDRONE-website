const fs = require('fs');
const path = require('path');

const startFolder = __dirname;

// Function to remove the modal block by its unique ID
function removeModal(content) {
    const idPos = content.indexOf('id="consultationModal"');
    if (idPos === -1) return content;
    
    // Find the opening <div tag that contains this id
    let start = idPos;
    while (start > 0 && content[start] !== '<') start--;
    if (content[start] !== '<') return content;
    
    let divCount = 0;
    let i = start;
    while (i < content.length) {
        if (content.substr(i, 4) === '<div') divCount++;
        else if (content.substr(i, 5) === '</div') {
            divCount--;
            if (divCount === 0) {
                // Find the closing '>' of this closing tag
                let end = i;
                while (end < content.length && content[end] !== '>') end++;
                end++; // include '>'
                // Remove the whole block
                return content.slice(0, start) + content.slice(end);
            }
        }
        i++;
    }
    return content;
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = removeModal(content);
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Removed modal from: ${filePath}`);
        return true;
    }
    return false;
}

function walkDirectory(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        let stat;
        try { stat = fs.statSync(fullPath); } catch (err) { continue; }
        if (stat.isDirectory()) {
            if (item === 'node_modules' || item === '.git') continue;
            walkDirectory(fullPath);
        } else if (stat.isFile() && fullPath.endsWith('.html')) {
            console.log(`🔍 Scanning: ${fullPath}`);
            processFile(fullPath);
        }
    }
}

console.log('🔍 Starting scan for consultation modal...\n');
walkDirectory(startFolder);
console.log('\n✅ Done.');