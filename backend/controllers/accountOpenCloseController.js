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

const executeAccountOpenCloseReport = async (req, res, responseMode = 'json') => {
    try {
        const flag = req.body.flag || req.query.flag || 'OPEN';
        const fbrcd = req.body.fbrcd || req.query.fbrcd || '1';
        const tbrcd = req.body.tbrcd || req.query.tbrcd || '1';
        const fromDate = formatDbDate(req.body.fromDate || req.query.fromDate || '2025-04-01');
        const toDate = formatDbDate(req.body.toDate || req.query.toDate || '2025-07-26');
        const subgl = req.body.subgl || req.query.subgl || '1';
        const tsubgl = req.body.tsubgl || req.query.tsubgl || '1';

        const pool = await poolPromise;
        const result = await pool.request()
            .input('flag', sql.VarChar(50), flag)
            .input('fbrcd', sql.VarChar(50), fbrcd)
            .input('tbrcd', sql.VarChar(50), tbrcd)
            .input('fdate', sql.VarChar(50), fromDate)
            .input('tdate', sql.VarChar(50), toDate)
            .input('subgl', sql.VarChar(50), subgl)
            .input('tsubgl', sql.VarChar(50), tsubgl)
            .execute('AN_ACCOPCLRPT');

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
                `ACCOUNT OPEN CLOSE REPORT (${flag.toUpperCase()})`,
                `From Date: ${fromDate}  To Date: ${toDate}`,
                `Branch: ${fbrcd} to ${tbrcd}  Products: ${subgl} to ${tsubgl}`,
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
            res.setHeader('Content-Disposition', `inline; filename="account_open_close_${flag}_${fromDate}_to_${toDate}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        res.json({
            success: true,
            data: rows,
            message: `Account ${flag === 'OPEN' ? 'Open' : 'Close'} Report retrieved successfully.`
        });

    } catch (err) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.send(`Error executing Account Open Close Report: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getAccountOpenCloseReport = (req, res) => executeAccountOpenCloseReport(req, res, 'json');
exports.getAccountOpenCloseTextReportView = (req, res) => executeAccountOpenCloseReport(req, res, 'text');
