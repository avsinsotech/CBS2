require('dotenv').config();
const { sql, poolPromise } = require('./config/db');

async function test() {
    try {
        const pool = await poolPromise;
        const res = await pool.request().query(`
            SELECT p.name, t.name AS type_name, p.max_length
            FROM sys.parameters p
            JOIN sys.types t ON p.user_type_id = t.user_type_id
            WHERE p.object_id = OBJECT_ID('SP_TRAILBALANCE_1');
        `);
        console.table(res.recordset);
    } catch (err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
test();
