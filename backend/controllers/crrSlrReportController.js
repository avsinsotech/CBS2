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

const executeCrrSlrReport = async (req, res, responseMode = 'json') => {
    try {
        const reportType = req.body.reportType || req.query.reportType || 'CRR'; // 'CRR' | 'SLR' | 'CRR1'
        const branchCode = req.body.branchCode || req.query.branchCode || '1';
        const asOnDateStr = convertToSqlDate(req.body.asOnDate || req.query.asOnDate);
        const toDateStr = convertToSqlDate(req.body.toDate || req.query.toDate);

        let spName = 'ISP_CRR';
        let flagVal = 'CRR';

        if (reportType.toUpperCase() === 'SLR') {
            spName = 'ISP_SLR';
            flagVal = 'SLR';
        } else if (reportType.toUpperCase() === 'CRR1') {
            spName = 'ISP_CRR1';
            flagVal = 'CRR';
        }

        const pool = await poolPromise;
        const request = pool.request();
        request.timeout = 600000; // 10 minutes

        const result = await request
            .input('Flag', sql.VarChar(100), flagVal)
            .input('Brcd', sql.VarChar(10), branchCode)
            .input('PFDT', sql.DateTime, asOnDateStr ? new Date(asOnDateStr) : null)
            .input('PTDT', sql.DateTime, toDateStr ? new Date(toDateStr) : null)
            .execute(spName);

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
                `${reportType.toUpperCase()} REPORT`,
                `Branch: ${branchCode}  Period: ${asOnDateStr} to ${toDateStr}`,
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
            res.setHeader('Content-Disposition', `inline; filename="${reportType.toLowerCase()}_report_${asOnDateStr}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        res.json({
            success: true,
            data: rows,
            message: `${reportType.toUpperCase()} Report retrieved successfully.`
        });

    } catch (err) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain');
            return res.send(`Error executing CRR/SLR Report: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getCrrSlrReport = (req, res) => executeCrrSlrReport(req, res, 'json');
exports.getCrrSlrTextReport = (req, res) => executeCrrSlrReport(req, res, 'text');
