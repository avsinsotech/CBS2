const { sql, poolPromise } = require('../config/db');

// SP_LOANDEPOREG
exports.getLoanDepoReg = async (req, res) => {
    const flag      = req.query.flag      || '';
    const subglcode = req.query.subglcode || '';
    const brcd      = req.query.brcd      || '';
    const tdate     = req.query.tdate     || '';

    if (!flag || !subglcode || !brcd || !tdate) {
        return res.status(400).json({ success: false, error: 'Missing required parameters. Required: flag, subglcode, brcd, tdate' });
    }
    const parsedDate = new Date(tdate);
    if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ success: false, error: 'Invalid date format for tdate. Use YYYY-MM-DD.' });
    }
    try {
        const pool    = await poolPromise;
        const request = pool.request();
        request.input('FLAG',      sql.VarChar(25), flag.toUpperCase());
        request.input('SUBGLCODE', sql.VarChar(25), subglcode);
        request.input('BRCD',      sql.VarChar(25), brcd);
        request.input('TDATE',     sql.DateTime,    parsedDate);

        console.log(`Executing SP_LOANDEPOREG: FLAG=${flag.toUpperCase()}, SUBGLCODE=${subglcode}, BRCD=${brcd}, TDATE=${tdate}`);

        const result = await request.execute('SP_LOANDEPOREG');
        return res.status(200).json({
            success: true,
            parameters: { flag: flag.toUpperCase(), subglcode, brcd, tdate },
            rowCount: result.recordset?.length || 0,
            data: result.recordset || []
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Database query execution failed', details: err.message });
    }
};
