require('dotenv').config();
const { sql, poolPromise } = require('./config/db');

async function test() {
    try {
        const pool = await poolPromise;
        console.log('Connected. Starting SP AN_ACCOPCLRPT...');
        console.log('Time:', new Date().toLocaleTimeString());
        
        const queryStr = `
            SET NOCOUNT ON;
            SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
            EXEC AN_ACCOPCLRPT @flag='CLOSE',@fbrcd='1',@tbrcd='1',@fdate='2025-04-01',@tdate='2025-07-26',@subgl='1',@tsubgl='1';
        `;
        
        const request = pool.request();
        request.stream = true;
        request.timeout = 300000; // 5 minute timeout
        
        await new Promise((resolve, reject) => {
            let rowCount = 0;
            let infoCount = 0;
            let recordsetCount = 0;

            request.on('recordset', columns => {
                recordsetCount++;
                console.log(`Recordset #${recordsetCount} received with columns:`, Object.keys(columns).join(', '));
            });

            request.on('row', row => {
                rowCount++;
                if (rowCount <= 10) console.log('Row', rowCount, ':', JSON.stringify(row));
            });
            
            request.on('error', err => {
                console.log('Error:', err.message);
                reject(err);
            });
            
            request.on('done', result => {
                console.log('DONE! Time:', new Date().toLocaleTimeString());
                console.log('Total rows:', rowCount);
                console.log('Total recordsets:', recordsetCount);
                console.log('Result:', JSON.stringify(result));
                resolve();
            });
            
            request.on('info', msg => {
                infoCount++;
            });
            
            request.query(queryStr);
        });
    } catch (err) {
        console.error('Fatal error:', err);
    } finally {
        process.exit(0);
    }
}

test();
