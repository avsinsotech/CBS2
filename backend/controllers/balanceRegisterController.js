const { sql, poolPromise } = require('../config/db');

exports.getBalanceRegisterReport = async (req, res) => {
    try {
        const { branchCode, glCode, subGLCode, asOnDate } = req.query;

        if (!branchCode || !glCode || !asOnDate) {
            return res.status(400).json({ error: "Please provide branchCode, glCode, and asOnDate query parameters" });
        }

        const pool = await poolPromise;
        
        // Execute the stored procedure with correct SP parameter names
        const result = await pool.request()
            .input('BranchCode', sql.VarChar, branchCode)
            .input('GlCode', sql.VarChar, glCode)
            .input('SubGlCode', sql.VarChar, subGLCode || glCode)
            .input('AsonDate', sql.Date, asOnDate)
            .execute('RptBalanceRegisterReport');
        
        // The recordsets are returned. Assuming single result set, use recordset
        res.json(result.recordset || result.recordsets[0]);
    } catch (err) {
        console.error('Balance Register Error:', err);
        res.status(500).json({ error: err.message || err.toString(), stack: err.stack });
    }
};
