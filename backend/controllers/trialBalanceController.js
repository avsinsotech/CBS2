const { sql, poolPromise } = require('../config/db');

const executeTrialBalance = async (req, res, responseMode = 'json') => {
    try {
        const toDate = req.query.toDate || req.body.toDate || '2026-05-21';
        const branchCode = req.query.branchCode || req.body.branchCode || '1';
        const sortWise = req.query.sortWise || req.body.sortWise || 'CodeWise'; // 'CodeWise' or 'NameWise'

        // Extract month and year from toDate (format: YYYY-MM-DD)
        const dateObj = new Date(toDate);
        if (isNaN(dateObj.getTime())) {
            throw new Error('Invalid To Date format. Expected YYYY-MM-DD.');
        }
        
        const pfYear = String(dateObj.getFullYear());
        const pfMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
        const pfDt = toDate;
        const cnyn = sortWise === 'NameWise' ? 'N' : 'C';

        const pool = await poolPromise;
        const request = pool.request();
        request.timeout = 600000; // 10 minutes

        const result = await request
            .input('PFMONTH', sql.VarChar(10), pfMonth)
            .input('PFYEAR', sql.VarChar(10), pfYear)
            .input('PFDT', sql.VarChar(30), pfDt)
            .input('PBRCD', sql.VarChar(30), branchCode)
            .input('CNYN', sql.VarChar(5), cnyn)
            .execute('SP_TRAILBALANCE');

        const rows = result.recordset || result.recordsets[0] || [];

        if (responseMode === 'text') {
            if (rows.length === 0) {
                res.setHeader('Content-Type', 'text/plain');
                return res.send('No records found.');
            }

            const columns = Object.keys(rows[0]);
            const colWidths = columns.map((col) =>
                Math.max(col.length, ...rows.map((r) => String(r[col] ?? '').length))
            );

            const separator = colWidths.map((w) => '-'.repeat(w + 2)).join('+');
            const header    = columns.map((col, i) => col.padEnd(colWidths[i])).join(' | ');
            const dataLines = rows.map((row) =>
                columns.map((col, i) => String(row[col] ?? '').padEnd(colWidths[i])).join(' | ')
            );

            const reportLines = [
                `TRIAL BALANCE REPORT`,
                `Date: ${toDate}  |  Branch: ${branchCode}  |  Sort: ${sortWise}`,
                `Generated: ${new Date().toLocaleString()}`,
                `Total Records: ${rows.length}`,
                '',
                separator,
                header,
                separator,
                ...dataLines,
                separator,
            ];

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Content-Disposition', `inline; filename="trial_balance_${toDate}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        res.json({
            success: true,
            data: rows,
            rowCount: rows.length,
            message: 'Trial balance report retrieved successfully.'
        });

    } catch (err) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain');
            return res.send(`Error executing Trial Balance: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getTrialBalance = (req, res) => executeTrialBalance(req, res, 'json');
exports.getTrialBalanceText = (req, res) => executeTrialBalance(req, res, 'text');
