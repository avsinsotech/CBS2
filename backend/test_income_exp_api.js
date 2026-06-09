const http = require('http');

http.get('http://localhost:5000/api/profit-and-loss/income-exp-profit-loss-report?branchCode=1&fromDate=2026-04-01&toDate=2026-05-06', (res) => {
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
