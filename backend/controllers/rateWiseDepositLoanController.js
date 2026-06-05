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

const executeRateWiseDepositLoan = async (req, res) => {
    let responseMode = 'json';
    try {
        const fromBr      = req.query.fromBr      || req.body.fromBr      || '1';
        const toBr        = req.query.toBr        || req.body.toBr        || '2';
        const productCode = req.query.productCode || req.body.productCode || '1';
        const asOnDate    = req.query.asOnDate    || req.body.asOnDate    || '2026-05-22';
        const fromIntRate = req.query.fromIntRate  || req.body.fromIntRate  || '0';
        const toIntRate   = req.query.toIntRate   || req.body.toIntRate   || '999999';
        responseMode      = req.query.mode        || req.body.mode        || 'json';

        const pool = await poolPromise;
        const request = pool.request();
        request.timeout = 600000; // 10 minutes
        const result = await request
            .input('FromBr',      sql.VarChar(10), fromBr)
            .input('ToBr',        sql.VarChar(10), toBr)
            .input('ProductCode', sql.VarChar(10), productCode)
            .input('Asondate',    sql.VarChar(20), asOnDate)
            .input('FIntRate',    sql.VarChar(20), fromIntRate)
            .input('TIntRate',    sql.VarChar(20), toIntRate)
            .execute('RptIntRateSummaryDPList_DT');

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
                'RATE WISE DEPOSIT & LOAN REPORT',
                `BRCD: ${fromBr} → ${toBr}  |  Product: ${productCode}  |  As On: ${asOnDate}  |  Rate: ${fromIntRate} → ${toIntRate}`,
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
            res.setHeader('Content-Disposition', `inline; filename="rate_wise_deposit_loan_${asOnDate}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        // Default JSON response
        res.json({
            success: true,
            data: formattedRows,
            rowCount: formattedRows.length,
            parameters: { fromBr, toBr, productCode, asOnDate, fromIntRate, toIntRate },
            message: 'Rate Wise Deposit & Loan report retrieved successfully.'
        });

    } catch (err) {
        console.error('Error executing Rate Wise Deposit & Loan report:', err);
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.send(`Error: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getRateWiseDepositLoanReport = executeRateWiseDepositLoan;
