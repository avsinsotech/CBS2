const { sql, poolPromise } = require('../config/db');

exports.updateRiskCategory = async (req, res) => {
    try {
        const fromBrcd = req.body.fromBrcd || req.query.fromBrcd || '1';
        const toBrcd = req.body.toBrcd || req.query.toBrcd || '2';
        const fromDate = req.body.fromDate || req.query.fromDate || '2025-04-01';
        const toDate = req.body.toDate || req.query.toDate || '2025-07-26';
        const fromAmount = req.body.fromAmount || req.query.fromAmount || '233';
        const flag = req.body.flag || req.query.flag || 'UPDATE';
        const mid = req.body.mid || req.query.mid || '2';

        const pool = await poolPromise;
        const result = await pool.request()
            .input('FROMBRCD', sql.VarChar(16), fromBrcd)
            .input('TOBRCD', sql.VarChar(16), toBrcd)
            .input('FROMDATE', sql.VarChar(10), fromDate)
            .input('TODATE', sql.VarChar(10), toDate)
            .input('FROMAMOUNT', sql.VarChar(50), fromAmount)
            .input('FLAG', sql.VarChar(20), flag)
            .input('MID', sql.VarChar(16), mid)
            .execute('USP_CTR_CUSTOMER_RiskCategory');

        let message = 'Risk Category action completed successfully.';
        if (flag.toUpperCase() === 'UPDATE') {
            message = 'Risk Category update completed successfully.';
        } else if (flag.toUpperCase() === 'KYCSUMMARY') {
            message = 'KYC Summary match report retrieved successfully.';
        } else if (flag.toUpperCase() === 'S') {
            message = 'Risk Category Summary retrieved successfully.';
        } else if (flag.toUpperCase() === 'D') {
            message = 'Transaction Risk Category Report retrieved successfully.';
        }



        res.json({
            success: true,
            data: result.recordset || result.recordsets[0] || [],
            message: message
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getCtrLimitReport = async (req, res) => {
    try {
        const fromBrcd = req.body.fromBrcd || req.query.fromBrcd || '1';
        const toBrcd = req.body.toBrcd || req.query.toBrcd || '2';
        const fromDate = req.body.fromDate || req.query.fromDate || '2025-04-01';
        const toDate = req.body.toDate || req.query.toDate || '2025-07-26';
        const fromAmount = req.body.fromAmount || req.query.fromAmount || '233';

        const pool = await poolPromise;
        const result = await pool.request()
            .input('FROMBRCD', sql.VarChar(16), fromBrcd)
            .input('TOBRCD', sql.VarChar(16), toBrcd)
            .input('FROMDATE', sql.VarChar(10), fromDate)
            .input('TODATE', sql.VarChar(10), toDate)
            .input('FROMAMOUNT', sql.VarChar(50), fromAmount)
            .execute('USP_CTR_CUSTOMER_REPORT');

        res.json({
            success: true,
            data: result.recordset || result.recordsets[0] || [],
            message: 'CTR Limit Report retrieved successfully.'
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getCtrGeneralReport = async (req, res) => {
    try {
        const brcd = req.body.brcd || req.query.brcd || '1';
        const flag = req.body.flag || req.query.flag || 'DEBIT'; // DEBIT or CREDIT
        const fromDate = req.body.fromDate || req.query.fromDate || '2025-04-01';
        const toDate = req.body.toDate || req.query.toDate || '2025-07-26';
        const fsgl = req.body.fsgl || req.query.fsgl || '1';
        const tsgl = req.body.tsgl || req.query.tsgl || '1';
        const ctrLimit = req.body.ctrLimit || req.query.ctrLimit || '233';

        // Extract year and month from fromDate (YYYY-MM-DD)
        const fParts = fromDate.split('-');
        const fYear = parseInt(fParts[0]) || 2025;
        const fMonth = parseInt(fParts[1]) || 4;

        // Extract year and month from toDate (YYYY-MM-DD)
        const tParts = toDate.split('-');
        const tYear = parseInt(tParts[0]) || 2025;
        const tMonth = parseInt(tParts[1]) || 7;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('Brcd', sql.VarChar(50), brcd)
            .input('FLAG', sql.VarChar(50), flag)
            .input('FYEAR', sql.Int, fYear)
            .input('TYEAR', sql.Int, tYear)
            .input('FMONTH', sql.Int, fMonth)
            .input('TMONTH', sql.Int, tMonth)
            .input('FSGL', sql.VarChar(25), fsgl)
            .input('TSGL', sql.VarChar(25), tsgl)
            .input('CTRLIMIT', sql.VarChar(25), ctrLimit)
            .execute('SP_CTRReport');

        res.json({
            success: true,
            data: result.recordset || result.recordsets[0] || [],
            message: `CTR ${flag === 'CREDIT' ? 'Credit' : 'Debit'} Report retrieved successfully.`
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


