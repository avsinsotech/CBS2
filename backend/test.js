require('dotenv').config();
const { poolPromise, sql } = require('./config/db');

async function run() {
  try {
    const pool = await poolPromise;
    console.log("Testing with FAKE FAKE password:");
    let req1 = pool.request();
    req1.input('UserId', sql.VarChar, 'xyz123');
    req1.input('PassWord', sql.VarChar, 'abc');
    req1.input('Date1', sql.VarChar, '2026-06-09');
    let res1 = await req1.execute('ISP_UserLogin');
    console.log("Fake Result:", JSON.stringify(res1, null, 2));

    console.log("\nTesting with REAL password:");
    let req2 = pool.request();
    req2.input('UserId', sql.VarChar, 'ROHI');
    req2.input('PassWord', sql.VarChar, 'iEmxT+Erd0AyJHhV0ShxSw==');
    req2.input('Date1', sql.VarChar, '2026-06-09');
    let res2 = await req2.execute('ISP_UserLogin');
    console.log("Real Result:", JSON.stringify(res2, null, 2));

    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
run();
