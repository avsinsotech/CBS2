const { sql, poolPromise } = require('../config/db');

// RptCuteBookDetails_SUM
exports.getCuteBookDetails = async (req, res) => {
    const brcd      = req.query.brcd      || '';
    const subglcode = req.query.subglcode || '';
    const fromDate  = req.query.fromDate  || '';
    const toDate    = req.query.toDate    || '';
    const custtype  = req.query.custtype  || '0';
    const acctype   = req.query.acctype   || '0';
    const flag      = req.query.flag      || '';
    const amount    = req.query.amount    || '';

    if (!brcd || !fromDate || !toDate) {
        return res.status(400).json({ success: false, error: 'Missing required parameters. Required: brcd, fromDate, toDate' });
    }
    const parsedFromDate = new Date(fromDate);
    const parsedToDate   = new Date(toDate);
    if (isNaN(parsedFromDate.getTime()) || isNaN(parsedToDate.getTime())) {
        return res.status(400).json({ success: false, error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    try {
        const pool    = await poolPromise;
        const request = pool.request();
        request.input('Brcd',      sql.VarChar(16),    brcd);
        request.input('SubGlCode', sql.VarChar(140),   subglcode);
        request.input('FromDate',  sql.DateTime,       parsedFromDate);
        request.input('ToDate',    sql.DateTime,       parsedToDate);
        request.input('CUSTTYPE',  sql.VarChar(10),    custtype);
        request.input('ACCTYPE',   sql.VarChar(10),    acctype);
        request.input('Flag',      sql.VarChar(100),   flag);
        request.input('amount',    sql.Decimal(18, 2), amount !== '' ? parseFloat(amount) : null);

        const result = await request.execute('RptCuteBookDetails_SUM');
        return res.status(200).json({
            success: true,
            parameters: { brcd, subglcode, fromDate, toDate, custtype, acctype, flag, amount: amount !== '' ? parseFloat(amount) : null },
            rowCount: result.recordset?.length || 0,
            data: result.recordset || []
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Database query execution failed', details: err.message });
    }
};
