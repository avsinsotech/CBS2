const http = require('http');

http.get('http://localhost:5000/api/profit-and-loss/profit-loss-report?branchCode=1&asOnDate=2026-03-30', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            console.log(Array.isArray(parsed) ? parsed.slice(0, 5) : parsed);
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });
}).on('error', err => {
    console.log('Error: ', err.message);
});
