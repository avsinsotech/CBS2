const { sql, poolPromise } = require('../config/db');

// Helper to format date strings into YYYY-MM-DD format for SQL Server
const formatDbDate = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }
    return dateStr;
};

const executeDailyBalLessThanClg = async (req, res, responseMode = 'json') => {
    try {
        const asOnDate = formatDbDate(req.body.asOnDate || req.query.asOnDate || '2026-01-11');
        const branchID = req.body.branchID || req.query.branchID || '1';
        const productCode = req.body.productCode || req.query.productCode || '1';
        const periodMM = req.body.periodMM || req.query.periodMM || '01';

        const pool = await poolPromise;
        const result = await pool.request()
            .input('AsonDate', sql.VarChar(50), asOnDate)
            .input('BrCd', sql.VarChar(50), branchID)
            .input('Product', sql.VarChar(50), productCode)
            .input('Period', sql.VarChar(50), periodMM)
            .execute('RptDailyBalanceLessThenClg');

        const rows = result.recordset || result.recordsets[0] || [];

        if (responseMode === 'text') {
            if (rows.length === 0) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                return res.send('No records found for the specified criteria.');
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
                'DAILY BALANCE LESS THAN CLOSING BAL REPORT',
                `As On Date: ${asOnDate}  Branch Code: ${branchID}  Product: ${productCode}  Period: ${periodMM}`,
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
            res.setHeader('Content-Disposition', `inline; filename="daily_bal_less_than_clg_${asOnDate}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        res.json({
            success: true,
            data: rows,
            message: 'Daily Balance Less Than Closing Bal Report retrieved successfully.'
        });

    } catch (err) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.send(`Error executing Daily Balance Less Than Closing Bal Report: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getDailyBalLessThanClgReport = (req, res) => executeDailyBalLessThanClg(req, res, 'json');
exports.getDailyBalLessThanClgTextReport = (req, res) => executeDailyBalLessThanClg(req, res, 'text');
