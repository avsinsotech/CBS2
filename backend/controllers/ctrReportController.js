const { sql, poolPromise } = require('../config/db');

function parseDateParts(dateStr, defaultYear, defaultMonth) {
    if (!dateStr) return { year: defaultYear, month: defaultMonth };
    let parts = dateStr.split('-');
    if (parts.length === 3) {
        return {
            year: parseInt(parts[0]) || defaultYear,
            month: parseInt(parts[1]) || defaultMonth
        };
    }
    parts = dateStr.split('/');
    if (parts.length === 3) {
        return {
            year: parseInt(parts[2]) || defaultYear,
            month: parseInt(parts[1]) || defaultMonth
        };
    }
    return { year: defaultYear, month: defaultMonth };
}

exports.updateRiskCategory = async (req, res) => {
    try {
        const fromBrcd = req.body.fromBrcd || req.query.fromBrcd || '1';
        const toBrcd = req.body.toBrcd || req.query.toBrcd || '2';
        const fromDate = req.body.fromDate || req.query.fromDate || '2025-04-01';
        const toDate = req.body.toDate || req.query.toDate || '2025-07-26';
        const fromAmount = req.body.fromAmount || req.query.fromAmount || '233';
        let flag = req.body.flag || req.query.flag || 'UPDATE';
        const mid = req.body.mid || req.query.mid || '2';

        // Map flag values to the exact casing expected by the SP
        const upperFlag = flag.toUpperCase();
        if (upperFlag === 'KYCSUMMARY') {
            flag = 'KYCSummary';
        } else if (upperFlag === 'UPDATE') {
            flag = 'UPDATE';
        } else if (upperFlag === 'S') {
            flag = 'S';
        } else if (upperFlag === 'D') {
            flag = 'D';
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('FROMBRCD', sql.Int, parseInt(fromBrcd) || 1)
            .input('TOBRCD', sql.Int, parseInt(toBrcd) || 2)
            .input('FROMDATE', sql.Date, fromDate)
            .input('TODATE', sql.Date, toDate)
            .input('FROMAMOUNT', sql.Numeric(30, 2), parseFloat(fromAmount) || 0.0)
            .input('FLAG', sql.NVarChar(20), flag)
            .input('MID', sql.NVarChar(20), mid)
            .execute('USP_CTR_CUSTOMER_RiskCategory');

        let message = 'Risk Category action completed successfully.';
        if (flag === 'UPDATE') {
            message = 'Risk Category update completed successfully.';
        } else if (flag === 'KYCSummary') {
            message = 'KYC Summary match report retrieved successfully.';
        } else if (flag === 'S') {
            message = 'Risk Category Summary retrieved successfully.';
        } else if (flag === 'D') {
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
            .input('FROMBRCD', sql.Int, parseInt(fromBrcd) || 1)
            .input('TOBRCD', sql.Int, parseInt(toBrcd) || 9999)
            .input('FROMDATE', sql.Date, fromDate)
            .input('TODATE', sql.Date, toDate)
            .input('FROMAMOUNT', sql.Numeric(30, 2), parseFloat(fromAmount) || 0.0)
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

        // Robust date parsing
        const fromParts = parseDateParts(fromDate, 2025, 4);
        const toParts = parseDateParts(toDate, 2025, 7);

        const pool = await poolPromise;
        const result = await pool.request()
            .input('Brcd', sql.VarChar(50), brcd)
            .input('FLAG', sql.VarChar(50), flag)
            .input('FYEAR', sql.Int, fromParts.year)
            .input('TYEAR', sql.Int, toParts.year)
            .input('FMONTH', sql.Int, fromParts.month)
            .input('TMONTH', sql.Int, toParts.month)
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



