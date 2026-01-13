const http = require('http');

const payload = JSON.stringify({
    email: "testuser@panaversity.org",
    password: "TestPassword123!",
    name: "Test User"
});

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/auth/signup/email',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 201) {
            console.log('User created successfully!');
            console.log('Response:', data);
        } else if (res.statusCode === 409) {
            console.log('User already exists (this is fine).');
        } else {
            console.error(`Failed to create user. Status Code: ${res.statusCode}`);
            console.error('Response:', data);
        }
    });
});

req.on('error', (error) => {
    console.error('Error making request:', error);
});

req.write(payload);
req.end();
