const { sql, poolPromise } = require('../config/db');

exports.getBalanceRegisterReport = async (req, res) => {
    try {
        const { branchCode, glCode, asOnDate } = req.query;

        if (!branchCode || !glCode || !asOnDate) {
            return res.status(400).json({ error: "Please provide branchCode, glCode, and asOnDate query parameters" });
        }

        const pool = await poolPromise;
        
        // Execute the stored procedure by passing parameters positionally
        // This matches 'Exec RptBalanceRegisterReport 1, 1, 2026-03-30' while staying safe from SQL injection
        const result = await pool.request()
            .input('branchCode', sql.VarChar, branchCode)
            .input('glCode', sql.VarChar, glCode)
            .input('asOnDate', sql.Date, asOnDate)
            .query('EXEC RptBalanceRegisterReport @branchCode, @glCode, @asOnDate');
        
        // The recordsets are returned. Assuming single result set, use recordset
        res.json(result.recordset || result.recordsets[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
