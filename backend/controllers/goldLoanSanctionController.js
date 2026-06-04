const { sql, poolPromise } = require('../config/db');

// Helper to format Date objects to DD/MM/YYYY for display
const formatDate = (val) => {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

// Map frontend reportType to SP @FL value
const flagMap = { details: 'DT', summary: 'SM' };

const executeGoldLoanSanction = async (req, res) => {
    let responseMode = 'json';
    try {
        const reportType   = req.query.reportType   || req.body.reportType   || 'summary';
        const fromBrcd     = req.query.fromBrcd     || req.body.fromBrcd     || '1';
        const toBrcd       = req.query.toBrcd       || req.body.toBrcd       || '1';
        const fromDate     = req.query.fromDate     || req.body.fromDate     || '2026-04-01';
        const toDate       = req.query.toDate       || req.body.toDate       || '2026-05-22';
        responseMode       = req.query.mode         || req.body.mode         || 'json';

        const fl = flagMap[reportType] || 'DT';

        const pool = await poolPromise;
        const request = pool.request();
        request.timeout = 600000; // 10 minutes
        const result = await request
            .input('FBRCD',   sql.VarChar(10), fromBrcd)
            .input('TBRCD',   sql.VarChar(10), toBrcd)
            .input('PrdCode', sql.VarChar(10), '204')
            .input('FDT',     sql.VarChar(20), fromDate)
            .input('TDT',     sql.VarChar(20), toDate)
            .input('EDATE',   sql.VarChar(20), toDate)
            .input('FL',      sql.VarChar(10), fl)
            .execute('Isp_AVS0041');

        const rows = result.recordset || result.recordsets?.[0] || [];

        // Format date columns
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

        // Text / valuation report mode
        if (responseMode === 'text' || responseMode === 'valuation') {
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

            const title = responseMode === 'valuation'
                ? 'GOLD LOAN SANCTION - NEW VALUATION REPORT'
                : 'GOLD LOAN SANCTION REPORT';
            const reportLines = [
                title,
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
            res.setHeader('Content-Disposition', `inline; filename="gold_loan_sanction_${fromDate}_${toDate}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        // Default JSON response
        res.json({
            success: true,
            data: formattedRows,
            rowCount: formattedRows.length,
            parameters: { reportType, fromBrcd, toBrcd, fromDate, toDate, fl },
            message: 'Gold Loan Sanction report retrieved successfully.'
        });

    } catch (err) {
        console.error('Error executing Gold Loan Sanction report:', err);
        if (responseMode === 'text' || responseMode === 'valuation') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.send(`Error: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getGoldLoanSanctionReport = executeGoldLoanSanction;
