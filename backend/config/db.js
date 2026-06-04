const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
    ? process.env.DB_PASSWORD.replace(/^"|"$/g, "")
    : undefined,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT) || 1433,
  requestTimeout: 300000,      // 5 minutes - some SPs take 45+ seconds
  connectionTimeout: 30000,    // 30 seconds for initial connection
  options: {
    encrypt: false,            // false for older SQL Server instances
    trustServerCertificate: true,
    enableArithAbort: true,
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1',    // Allow TLS 1.0 / 1.1
    },
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// ─── Singleton pool instance ──────────────────────────────────────────────────
let pool = null;

// ─── getPool: async getter, creates pool once ─────────────────────────────────
const getPool = async () => {
  if (!pool) {
    try {
      pool = await new sql.ConnectionPool(config).connect();
      console.log('✅ Connected to MSSQL');
    } catch (err) {
      console.error('❌ DB connection failed:', err.message);
      throw err;
    }
  }
  return pool;
};

// ─── poolPromise: eager promise for controllers that await it directly ────────
const poolPromise = getPool();

module.exports = { sql, getPool, poolPromise };