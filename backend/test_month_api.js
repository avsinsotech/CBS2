const http = require('http');

http.get('http://localhost:5000/api/product-wise-summary/report/month-wise?Brcd=1&SubGlCode=1&FromDate=2026-04-01&ToDate=2026-05-22&isMainType=Y', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const parsed = JSON.parse(data);
        const rows = Array.isArray(parsed) ? parsed : (parsed.data || []);
        console.log("Total rows:", rows.length);
        console.log("First 3 rows:", rows.slice(0, 3));
    });
}).on('error', err => console.error(err));
