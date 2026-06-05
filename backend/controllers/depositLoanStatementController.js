const { sql, poolPromise } = require('../config/db');

// Helper to format Date objects to DD/MM/YYYY
const formatDate = (val) => {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

const executeDepositLoanStatement = async (req, res) => {
    let responseMode = 'json';
    try {
        const branchCode = req.query.branchCode || req.body.branchCode || '1';
        const fromDate   = req.query.fromDate   || req.body.fromDate   || '2026-04-01';
        const toDate     = req.query.toDate     || req.body.toDate     || '2026-05-22';
        responseMode     = req.query.mode       || req.body.mode       || 'json';

        const pool = await poolPromise;
        const request = pool.request();
        request.timeout = 600000; // 10 minutes
        const result = await request
            .input('PFDT',  sql.VarChar(20), fromDate)
            .input('PTDT',  sql.VarChar(20), toDate)
            .input('PBRCD', sql.VarChar(10), branchCode)
            .execute('SP_TRAILBALANCE_DPLN');

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
                'DEPOSIT & LOAN STATEMENT (TRAIL BALANCE)',
                `Branch: ${branchCode}  |  Date: ${fromDate} → ${toDate}`,
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
            res.setHeader('Content-Disposition', `inline; filename="deposit_loan_statement_${fromDate}_${toDate}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        // Default JSON response
        res.json({
            success: true,
            data: formattedRows,
            rowCount: formattedRows.length,
            parameters: { branchCode, fromDate, toDate },
            message: 'Deposit & Loan Statement retrieved successfully.'
        });

    } catch (err) {
        console.error('Error executing Deposit & Loan Statement:', err);
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.send(`Error: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getDepositLoanStatement = executeDepositLoanStatement;
