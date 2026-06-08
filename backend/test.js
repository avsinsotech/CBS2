require('dotenv').config();
const { sql, poolPromise } = require('./config/db');

async function test() {
    try {
        const pool = await poolPromise;
        console.log('Connected. Starting SP...');
        console.log('Time:', new Date().toLocaleTimeString());
        
        const queryStr = `
            SET NOCOUNT ON;
            SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
            EXEC SP_OFFICEACCSTATUS_R @pfmonth='04', @ptmonth='03', @PFDT='2025-04-01', @PTDT='2026-03-30', @pfyear='2025', @ptyear='2026', @pat='1', @BRCD='1', @isMainType='N';
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
                if (rowCount <= 3) console.log('Row', rowCount, ':', JSON.stringify(row).substring(0, 200));
            });
            
            request.on('error', err => {
                console.log('Error:', err.message);
                reject(err);
            });
            
            request.on('done', result => {
                console.log('DONE! Time:', new Date().toLocaleTimeString());
                console.log('Total rows:', rowCount);
                console.log('Total recordsets:', recordsetCount);
                console.log('Total info/print messages:', infoCount);
                console.log('Result:', JSON.stringify(result));
                resolve();
            });
            
            request.on('info', msg => {
                infoCount++;
                if (infoCount % 5000 === 0) console.log(`... ${infoCount} info messages processed so far...`);
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
