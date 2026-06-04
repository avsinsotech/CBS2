const { sql, poolPromise } = require('../config/db');

// Trial Balance Report — Exec SP_TRAILBALANCE_1
exports.getTrialBalanceReport = async (req, res) => {
    try {
        const { fromDate, toDate, branchCode = '1', codeOrName = 'C' } = req.query;

        if (!fromDate || !toDate) {
            return res.status(400).json({ error: "Please provide fromDate and toDate query parameters" });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('PFDT', sql.VarChar, fromDate)
            .input('PTDT', sql.VarChar, toDate)
            .input('PBRCD', sql.VarChar, branchCode)
            .input('CNYN', sql.VarChar, codeOrName)
            .execute('SP_TRAILBALANCE_1');

        res.json(result.recordset || result.recordsets[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
