const http = require('http');

http.get('http://localhost:5000/api/profit-and-loss/nform-profit-loss-report?branchCode=1&fromDate=2026-04-01&toDate=2026-05-22', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const parsed = JSON.parse(data);
            const flatData = parsed.recordsets ? parsed.recordsets.flat() : (Array.isArray(parsed) ? parsed : parsed.data || []);
            console.log("Total rows:", flatData.length);
            console.log("First 3 rows:", flatData.slice(0, 3));
        } catch(e) { console.error(e); }
    });
}).on('error', err => console.error(err));
