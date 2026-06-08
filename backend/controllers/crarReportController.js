const { sql, poolPromise } = require('../config/db');

const convertToSqlDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            // DD/MM/YYYY -> YYYY-MM-DD
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
    }
    return dateStr;
};

const executeCrarReport = async (req, res, responseMode = 'json') => {
    try {
        const branchCode = req.body.branchCode || req.query.branchCode || '1';
        const asOnDateStr = convertToSqlDate(req.body.asOnDate || req.query.asOnDate);

        const pool = await poolPromise;
        const request = pool.request();
        request.timeout = 600000; // 10 minutes

        const result = await request
            .input('Flag', sql.VarChar(100), 'CRAR')
            .input('SFlag', sql.VarChar(100), null)
            .input('Brcd', sql.VarChar(10), branchCode)
            .input('OnDate', sql.DateTime, asOnDateStr ? new Date(asOnDateStr) : null)
            .execute('ISP_CRAR');

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
                `CRAR REPORT`,
                `Branch: ${branchCode}  As On Date: ${asOnDateStr}`,
                `Generated: ${new Date().toISOString()}`,
                `Total Records: ${rows.length}`,
                '',
                separator,
                header,
                separator,
                ...dataLines,
                separator,
            ];

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Content-Disposition', `inline; filename="crar_report_${asOnDateStr}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        res.json({
            success: true,
            data: rows,
            message: 'CRAR Report retrieved successfully.'
        });

    } catch (err) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain');
            return res.send(`Error executing CRAR Report: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getCrarReport = (req, res) => executeCrarReport(req, res, 'json');
exports.getCrarTextReport = (req, res) => executeCrarReport(req, res, 'text');
