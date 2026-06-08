const { sql, poolPromise } = require('../config/db');

// Trial Balance Report — Supporting Submit, Lazer, Text, Text Report View, and TB Format1
exports.getTrialBalanceReport = async (req, res) => {
    try {
        const { 
            fromDate, 
            toDate, 
            branchCode = '1', 
            codeOrName = 'C', 
            flag = 'SUBMIT', 
            mode = 'json', 
            textReportName = 'trial_balance' 
        } = req.query;

        if (!fromDate || !toDate) {
            return res.status(400).json({ error: "Please provide fromDate and toDate query parameters" });
        }

        const pool = await poolPromise;
        const request = pool.request();
        let result;

        if (flag === 'LAZER') {
            const fMonth = fromDate.split('-')[1] || '';
            const fYear = fromDate.split('-')[0] || '';

            result = await request
                .input('PFMONTH', sql.VarChar(10), fMonth)
                .input('PFYEAR', sql.VarChar(10), fYear)
                .input('PFDT', sql.VarChar(30), toDate) // PFDT acts as the target date in SP_TRAILBALANCE
                .input('PBRCD', sql.VarChar(30), branchCode)
                .input('CNYN', sql.VarChar(5), codeOrName)
                .execute('SP_TRAILBALANCE');
        } else if (flag === 'TB_FORMAT1') {
            result = await request
                .input('PFDT', sql.VarChar(30), fromDate)
                .input('PTDT', sql.VarChar(30), toDate)
                .input('PBRCD', sql.VarChar(30), branchCode)
                .input('CNYN', sql.VarChar(5), codeOrName)
                .execute('SP_TRAILBALANCE_bank');
        } else {
            // Default: SUBMIT
            result = await request
                .input('PFDT', sql.VarChar(30), fromDate)
                .input('PTDT', sql.VarChar(30), toDate)
                .input('PBRCD', sql.VarChar(30), branchCode)
                .input('CNYN', sql.VarChar(5), codeOrName)
                .execute('SP_TRAILBALANCE_1');
        }

        const rows = result.recordset || result.recordsets[0] || [];

        // Support plain text formatting modes
        if (mode === 'text' || mode === 'download') {
            if (rows.length === 0) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                return res.send('No records found.');
            }

            const columns = Object.keys(rows[0]);
            const numericColumns = ['OPBAL', 'CR', 'DR', 'credit', 'debit', 'Closing', 'debit_bal', 'credit_bal'];

            const colWidths = columns.map(col => 
                Math.max(col.length, ...rows.map(r => String(r[col] ?? '').length))
            );

            const separator = colWidths.map(w => '-'.repeat(w + 2)).join('+');
            const header = columns.map((col, i) => col.padEnd(colWidths[i])).join(' | ');
            const dataLines = rows.map(row => 
                columns.map((col, i) => {
                    const val = String(row[col] ?? '');
                    if (numericColumns.includes(col)) {
                        return val.padStart(colWidths[i]);
                    }
                    return val.padEnd(colWidths[i]);
                }).join(' | ')
            );

            const reportTitle = `TRIAL BALANCE REPORT (${flag})`;
            const reportSubtitle = `Period: ${fromDate} to ${toDate} | Branch: ${branchCode} | Sort: ${codeOrName === 'C' ? 'Code Wise' : 'Name Wise'}`;
            const reportGenerated = `Generated: ${new Date().toLocaleString()}`;

            const reportText = [
                reportTitle,
                reportSubtitle,
                reportGenerated,
                `Total Records: ${rows.length}`,
                '',
                separator,
                header,
                separator,
                ...dataLines,
                separator
            ].join('\n');

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            if (mode === 'download') {
                res.setHeader('Content-Disposition', `attachment; filename="${textReportName || 'trial_balance'}.txt"`);
            } else {
                res.setHeader('Content-Disposition', `inline; filename="${textReportName || 'trial_balance'}.txt"`);
            }
            return res.send(reportText);
        }

        // Default: return JSON
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

