const http = require('http');

http.get('http://localhost:4000/api/health/db', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Body:', data);
    });
}).on('error', (err) => {
    console.log('Error:', err.message);
});
