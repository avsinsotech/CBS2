const { sql, poolPromise } = require('../config/db');

const convertToSqlDate = (dateStr) => {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            // DD/MM/YYYY -> YYYY-MM-DD
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
    }
    return dateStr;
};

const getMonthDifference = (startDateStr, endDateStr) => {
    try {
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 12;
        const diff = (start.getFullYear() - end.getFullYear()) * 12 + (start.getMonth() - end.getMonth());
        return diff > 0 ? diff : 0;
    } catch {
        return 12;
    }
};

const executeInOperativeAccList = async (req, res, responseMode = 'json') => {
    try {
        const branchCode = req.body.branchCode || req.query.branchCode || '1';
        const productType = req.body.productType || req.query.productType || '';
        const mode = req.body.mode || req.query.mode || 'Period';
        const asOnDateStr = convertToSqlDate(req.body.asOnDate || req.query.asOnDate);
        
        let periodMM = parseInt(req.body.periodMM || req.query.periodMM || '12', 10);
        if (mode === 'DueDate') {
            const dueDateStr = convertToSqlDate(req.body.dueDate || req.query.dueDate);
            periodMM = getMonthDifference(asOnDateStr, dueDateStr);
        }

        const pool = await poolPromise;
        const request = pool.request();
        request.timeout = 600000; // 10 minutes

        const result = await request
            .input('FBCODE', sql.VarChar(10), branchCode)
            .input('TBCODE', sql.VarChar(10), branchCode)
            .input('SCODE', sql.VarChar(10), productType)
            .input('ASONDATE', sql.VarChar(10), asOnDateStr)
            .input('FMONTH', sql.Int, periodMM)
            .execute('SP_UNOPACCRPT');

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
                `INOPERATIVE ACCOUNT LIST`,
                `Branch: ${branchCode}  Product: ${productType}  As On Date: ${asOnDateStr}  Period (Months): ${periodMM}`,
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
            res.setHeader('Content-Disposition', `inline; filename="inoperative_acc_list_${asOnDateStr}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        res.json({
            success: true,
            data: rows,
            message: 'InOperative Account List retrieved successfully.'
        });

    } catch (err) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain');
            return res.send(`Error executing InOperative Account List Report: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getInOperativeAccList = (req, res) => executeInOperativeAccList(req, res, 'json');
exports.getInOperativeAccListText = (req, res) => executeInOperativeAccList(req, res, 'text');
