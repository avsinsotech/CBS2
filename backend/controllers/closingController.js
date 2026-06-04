const { sql, poolPromise } = require('../config/db');

// SP_Closing
exports.getClosing = async (req, res) => {
    const brcd     = req.query.brcd     || '';
    const gl       = req.query.gl       || '';
    const fromDate = req.query.fromDate || '';
    const toDate   = req.query.toDate   || '';

    if (!brcd || !gl || !fromDate || !toDate) {
        return res.status(400).json({ success: false, error: 'Missing required parameters. Required: brcd, gl, fromDate, toDate' });
    }
    const parsedFromDate = new Date(fromDate);
    const parsedToDate   = new Date(toDate);
    if (isNaN(parsedFromDate.getTime()) || isNaN(parsedToDate.getTime())) {
        return res.status(400).json({ success: false, error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    try {
        const pool    = await poolPromise;
        const request = pool.request();
        request.input('Brcd',     sql.VarChar(16),  brcd);
        request.input('Gl',       sql.VarChar(140), gl);
        request.input('FromDate', sql.DateTime,     parsedFromDate);
        request.input('ToDate',   sql.DateTime,     parsedToDate);

        const result = await request.execute('SP_Closing');
        return res.status(200).json({
            success: true,
            parameters: { brcd, gl, fromDate, toDate },
            rowCount: result.recordset?.length || 0,
            data: result.recordset || []
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Database query execution failed', details: err.message });
    }
};
