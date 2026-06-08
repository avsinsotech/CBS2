const { sql, poolPromise } = require('../config/db');

exports.getKycReport = async (req, res) => {
    try {
        const flag = req.body.flag || req.query.flag || 'Dump'; // Dump, All, Complete, Pending
        const tDate = req.body.tDate || req.query.tDate || '2026-03-28';
        
        // Optional parameters for All, Complete, Pending
        const fDate = req.body.fDate || req.query.fDate || '1900-01-01';
        const fBrcd = req.body.fBrcd || req.query.fBrcd || '1';
        const tBrcd = req.body.tBrcd || req.query.tBrcd || '9999';

        const pool = await poolPromise;
        const result = await pool.request()
            .input('Fdate', sql.VarChar(20), fDate)
            .input('TDate', sql.VarChar(20), tDate)
            .input('Flag', sql.VarChar(20), flag)
            .input('fBrcd', sql.VarChar(20), fBrcd)
            .input('tBrcd', sql.VarChar(20), tBrcd)
            .execute('ISP_AVS0140');

        res.json({
            success: true,
            data: result.recordset || result.recordsets[0] || [],
            message: `KYC Report (${flag}) retrieved successfully.`
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
