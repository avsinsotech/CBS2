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

const executeTdsReport = async (req, res, responseMode = 'json') => {
    try {
        const fromDate = formatDbDate(req.body.fromDate || req.query.fromDate || '2025-04-01');
        const toDate = formatDbDate(req.body.toDate || req.query.toDate || '2025-07-26');
        const branchCode = req.body.branchCode || req.query.branchCode || '0000';
        const fromCustNo = req.body.fromCustNo || req.query.fromCustNo || '1';
        const toCustNo = req.body.toCustNo || req.query.toCustNo || '999999999';
        const amount = req.body.amount || req.query.amount || '0';
        const flag = req.body.flag || req.query.flag || '';

        // Parse branchCode, fromCustNo, toCustNo to integers/bigints to match DB types
        const parsedBranchCode = parseInt(branchCode, 10) || 0;
        const parsedFromCustNo = parseInt(fromCustNo, 10) || 1;
        const parsedToCustNo = parseInt(toCustNo, 10) || 999999999;
        const parsedAmount = parseFloat(amount) || 0;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('PFDT', sql.Date, fromDate)
            .input('PTDT', sql.Date, toDate)
            .input('BRCD', sql.Int, parsedBranchCode)
            .input('FCUSTNO', sql.BigInt, parsedFromCustNo)
            .input('TCUSTNO', sql.BigInt, parsedToCustNo)
            .input('Amount', sql.Numeric(18, 2), parsedAmount)
            .input('FLAG', sql.VarChar(50), flag)
            .execute('RptTDSDetails');

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
                'TDS DETAILS REPORT',
                `Period: ${fromDate} to ${toDate}  Branch Code: ${branchCode}`,
                `Customer Range: ${fromCustNo} to ${toCustNo}  Amount Filter: ${amount}`,
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
            res.setHeader('Content-Disposition', `inline; filename="tds_details_${fromDate}_${toDate}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        res.json({
            success: true,
            data: rows,
            rowCount: rows.length,
            parameters: { fromDate, toDate, branchCode, fromCustNo, toCustNo, amount, flag }
        });

    } catch (err) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.send(`Error executing TDS Details Report: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getTdsReport = (req, res) => executeTdsReport(req, res, 'json');
exports.getTdsTextReport = (req, res) => executeTdsReport(req, res, 'text');
