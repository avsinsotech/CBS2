require('dotenv').config();
const { sql, poolPromise } = require('./config/db');

async function runTest() {
    try {
        const pool = await poolPromise;
        console.log('Running stored procedure with FLAG="D"...');
        const start = Date.now();
        
        const result = await pool.request()
            .input('FROMBRCD', sql.VarChar(16), '1')
            .input('TOBRCD', sql.VarChar(16), '2')
            .input('FROMDATE', sql.VarChar(10), '2025-04-01')
            .input('TODATE', sql.VarChar(10), '2025-07-26')
            .input('FROMAMOUNT', sql.VarChar(50), '233')
            .input('FLAG', sql.VarChar(20), 'D')
            .input('MID', sql.VarChar(16), '2')
            .execute('USP_CTR_CUSTOMER_RiskCategory');

        const end = Date.now();
        console.log('Execution finished successfully!');
        console.log(`Time taken: ${(end - start) / 1000} seconds`);
        console.log('result.recordset length:', result.recordset ? result.recordset.length : 'none');
    } catch (err) {
        console.error('Error during execution:', err);
    } finally {
        process.exit(0);
    }
}

runTest();
