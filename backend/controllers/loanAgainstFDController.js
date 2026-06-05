const { sql, poolPromise } = require('../config/db');

// Helper to format Date objects/strings to DD/MM/YYYY for display
const formatDate = (val) => {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

// Map frontend reportType to SP @FLAG value
const flagMap = { summary: '1', details: '2' };

const executeLoanAgainstFD = async (req, res) => {
    let responseMode = 'json';
    try {
        const reportType = req.query.reportType || req.body.reportType || 'summary';
        const fromBrcd   = req.query.fromBrcd   || req.body.fromBrcd   || '1';
        const toBrcd     = req.query.toBrcd     || req.body.toBrcd     || '1';
        const fromDate   = req.query.fromDate   || req.body.fromDate   || '2026-05-22';
        const toDate     = req.query.toDate     || req.body.toDate     || '2026-05-22';
        responseMode     = req.query.mode       || req.body.mode       || 'json';

        const flag = flagMap[reportType] || '1';

        const pool = await poolPromise;
        const request = pool.request();
        request.timeout = 600000; // 10 minutes
        const result = await request
            .input('FLAG',  sql.VarChar(10), flag)
            .input('FDATE', sql.VarChar(20), fromDate)
            .input('TDATE', sql.VarChar(20), toDate)
            .input('FBRCD', sql.VarChar(10), fromBrcd)
            .input('TBRCD', sql.VarChar(10), toBrcd)
            .execute('ISP_AVS0102');

        const rows = result.recordset || result.recordsets?.[0] || [];

        // Format any date columns for clean display
        const formattedRows = rows.map(row => {
            const newRow = {};
            for (const key of Object.keys(row)) {
                const v = row[key];
                if (v instanceof Date) {
                    newRow[key] = formatDate(v);
                } else {
                    newRow[key] = v;
                }
            }
            return newRow;
        });

        // Text report mode
        if (responseMode === 'text') {
            if (formattedRows.length === 0) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                return res.send('No records found for the specified criteria.');
            }

            const columns   = Object.keys(formattedRows[0]);
            const colWidths = columns.map(col =>
                Math.max(col.length, ...formattedRows.map(r => String(r[col] ?? '').length))
            );

            const separator = colWidths.map(w => '-'.repeat(w + 2)).join('+');
            const header    = columns.map((col, i) => col.padEnd(colWidths[i])).join(' | ');
            const dataLines = formattedRows.map(row =>
                columns.map((col, i) => String(row[col] ?? '').padEnd(colWidths[i])).join(' | ')
            );

            const reportLines = [
                'LOAN AGAINST FD REPORT',
                `Report Type: ${reportType.toUpperCase()}  |  BRCD: ${fromBrcd} → ${toBrcd}  |  Date: ${fromDate} → ${toDate}`,
                `Generated: ${new Date().toLocaleString()}`,
                `Total Records: ${formattedRows.length}`,
                '',
                separator,
                header,
                separator,
                ...dataLines,
                separator,
            ];

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Content-Disposition', `inline; filename="loan_against_fd_${fromDate}_${toDate}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        // Default JSON response
        res.json({
            success: true,
            data: formattedRows,
            rowCount: formattedRows.length,
            parameters: { reportType, fromBrcd, toBrcd, fromDate, toDate, flag },
            message: 'Loan Against FD report retrieved successfully.'
        });

    } catch (err) {
        console.error('Error executing Loan Against FD report:', err);
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.send(`Error: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getLoanAgainstFDReport = executeLoanAgainstFD;
