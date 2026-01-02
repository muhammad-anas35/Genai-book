const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env.local');

try {
    console.log('Reading .env.local...');
    const buffer = fs.readFileSync(envPath);

    // Check for BOM
    let content = '';
    if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
        console.log('Detected UTF-16 LE BOM. Converting...');
        content = buffer.toString('utf16le');
    } else if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
        console.log('Detected UTF-8 BOM. Removing...');
        content = buffer.toString('utf8').slice(1);
    } else {
        console.log('Assuming UTF-8...');
        content = buffer.toString('utf8');
    }

    // Fix line endings and whitespace
    const lines = content.split(/\r?\n/);
    const fixedLines = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return trimmed;
        // Fix spaces around =
        const parts = trimmed.split('=');
        if (parts.length < 2) return trimmed;
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        return `${key}=${value}`;
    });

    const newContent = fixedLines.join('\n');

    console.log('--- Content Preview ---');
    console.log(newContent);
    console.log('-----------------------');

    fs.writeFileSync(envPath, newContent, 'utf8');
    console.log('✅ Successfully wrote fixed .env.local with UTF-8 encoding');

} catch (error) {
    console.error('Error:', error.message);
}
