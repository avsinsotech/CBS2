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

// Trial Balance Lazer Report — Exec SP_TRAILBALANCE
exports.getTrialBalanceLazerReport = async (req, res) => {
    try {
        const { toDate, branchCode = '1', codeOrName = 'C' } = req.query;

        if (!toDate) {
            return res.status(400).json({ error: "Please provide toDate query parameter" });
        }

        const pfMonth = toDate.slice(5, 7);
        const pfYear = toDate.slice(0, 4);

        const pool = await poolPromise;
        const result = await pool.request()
            .input('PFMONTH', sql.VarChar, pfMonth)
            .input('PFYEAR', sql.VarChar, pfYear)
            .input('PFDT', sql.VarChar, toDate)
            .input('PBRCD', sql.VarChar, branchCode)
            .input('CNYN', sql.VarChar, codeOrName)
            .execute('SP_TRAILBALANCE');

        res.json(result.recordset || result.recordsets[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

