const { sql, poolPromise } = require('../config/db');

// RptCuteBookDetails_SUM
const executeCuteBookDetails = async (req, res, responseMode = 'json') => {
    const brcd      = req.query.brcd      || '';
    const subglcode = req.query.subglcode || '';
    const fromDate  = req.query.fromDate  || '';
    const toDate    = req.query.toDate    || '';
    const custtype  = req.query.custtype  || '0';
    const acctype   = req.query.acctype   || '0';
    const flag      = req.query.flag      || '';
    const amount    = req.query.amount    || '';

    if (!brcd || !fromDate || !toDate) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.send('Missing required parameters. Required: brcd, fromDate, toDate');
        }
        return res.status(400).json({ success: false, error: 'Missing required parameters. Required: brcd, fromDate, toDate' });
    }
    const parsedFromDate = new Date(fromDate);
    const parsedToDate   = new Date(toDate);
    if (isNaN(parsedFromDate.getTime()) || isNaN(parsedToDate.getTime())) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.send('Invalid date format. Use YYYY-MM-DD.');
        }
        return res.status(400).json({ success: false, error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    // Map non-numeric string inputs to prevent SQL Server conversion errors
    let mappedCustType = custtype;
    if (isNaN(custtype)) {
        const lower = custtype.toLowerCase();
        if (lower === 'individual') mappedCustType = '1';
        else if (lower === 'joint') mappedCustType = '2';
        else if (lower === 'corporate') mappedCustType = '3';
        else mappedCustType = '0';
    }

    let mappedAccType = acctype;
    if (isNaN(acctype)) {
        const lower = acctype.toLowerCase();
        if (lower === 'normal') mappedAccType = '1';
        else if (lower === 'senior citizen') mappedAccType = '2';
        else if (lower === 'staff') mappedAccType = '3';
        else mappedAccType = '0'; // default/fallback to ignore filter
    }

    try {
        const pool    = await poolPromise;
        const request = pool.request();
        request.timeout = 600000; // 10 minutes
        request.input('Brcd',      sql.VarChar(16),    brcd);
        request.input('SubGlCode', sql.VarChar(140),   subglcode);
        request.input('FromDate',  sql.DateTime,       parsedFromDate);
        request.input('ToDate',    sql.DateTime,       parsedToDate);
        request.input('CUSTTYPE',  sql.VarChar(10),    mappedCustType);
        request.input('ACCTYPE',   sql.VarChar(10),    mappedAccType);
        request.input('Flag',      sql.VarChar(100),   flag);
        request.input('amount',    sql.Decimal(18, 2), amount !== '' ? parseFloat(amount) : null);

        const result = await request.execute('RptCuteBookDetails_SUM');
        const rows = result.recordset || [];

        if (responseMode === 'text') {
            if (rows.length === 0) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
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
                `CUT BOOK REPORT`,
                `From Date: ${fromDate}  To Date: ${toDate}  Branch: ${brcd}  Flag: ${flag}`,
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
            res.setHeader('Content-Disposition', `inline; filename="cute_book_report_${fromDate}_${toDate}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        return res.status(200).json({
            success: true,
            parameters: { brcd, subglcode, fromDate, toDate, custtype: mappedCustType, acctype: mappedAccType, flag, amount: amount !== '' ? parseFloat(amount) : null },
            rowCount: rows.length,
            data: rows
        });
    } catch (err) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.send(`Database query execution failed: ${err.message}`);
        }
        return res.status(500).json({ success: false, error: 'Database query execution failed', details: err.message });
    }
};

exports.getCuteBookDetails = (req, res) => executeCuteBookDetails(req, res, 'json');
exports.getCuteBookTextReportView = (req, res) => executeCuteBookDetails(req, res, 'text');
