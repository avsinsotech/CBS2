const { sql, poolPromise } = require('../config/db');

// Helper to run SP with streaming to handle PRINT message spam
// SP_OFFICEACCSTATUS_R outputs ~13,000 PRINT messages and takes ~45 seconds
async function runStreamingSP(pool, queryStr) {
    return new Promise((resolve, reject) => {
        const request = pool.request();
        request.stream = true;
        request.timeout = 300000; // 5 minutes
        const rows = [];
        request.on('row', row => {
            rows.push(row);
        });
        request.on('error', err => {
            reject(err);
        });
        request.on('done', () => {
            resolve(rows);
        });
        // Intentionally ignore 'info' events to discard the ~13,000 PRINT messages
        request.query(queryStr);
    });
}

// 1. Report Print - Details
exports.getReportDetails = async (req, res) => {
    try {
        const { pfmonth, ptmonth, PFDT, PTDT, pfyear, ptyear, pat, BRCD, isMainType } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0; // 0 = return all
        const pool = await poolPromise;
        const queryStr = `
            SET NOCOUNT ON;
            SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
            EXEC SP_OFFICEACCSTATUS_R @pfmonth='${pfmonth}', @ptmonth='${ptmonth}', @PFDT='${PFDT}', @PTDT='${PTDT}', @pfyear='${pfyear}', @ptyear='${ptyear}', @pat='${pat}', @BRCD='${BRCD}', @isMainType='${isMainType}';
        `;
        const rows = await runStreamingSP(pool, queryStr);
        if (limit > 0) {
            const start = (page - 1) * limit;
            const paged = rows.slice(start, start + limit);
            res.json({ total: rows.length, page, limit, data: paged });
        } else {
            res.json({ total: rows.length, data: rows });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 2. Report Print - Day Wise
exports.getReportDayWise = async (req, res) => {
    try {
        const { Brcd, SubGlCode, FromDate, ToDate, isMainType } = req.query;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Brcd', sql.VarChar, Brcd)
            .input('SubGlCode', sql.VarChar, SubGlCode)
            .input('FromDate', sql.VarChar, FromDate)
            .input('ToDate', sql.VarChar, ToDate)
            .input('isMainType', sql.VarChar, isMainType)
            .query('EXEC RptGLWiseTransDetails @Brcd=@Brcd, @SubGlCode=@SubGlCode, @FromDate=@FromDate, @ToDate=@ToDate, @isMainType=@isMainType');
        res.json(result.recordset || result.recordsets?.[0] || []);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 3. Report Print - Month Wise
exports.getReportMonthWise = async (req, res) => {
    try {
        const { Brcd, SubGlCode, FromDate, ToDate, isMainType } = req.query;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Brcd', sql.VarChar, Brcd)
            .input('SubGlCode', sql.VarChar, SubGlCode)
            .input('FromDate', sql.VarChar, FromDate)
            .input('ToDate', sql.VarChar, ToDate)
            .input('isMainType', sql.VarChar, isMainType)
            .query('EXEC RptGLWiseTransMonthWise @Brcd=@Brcd, @SubGlCode=@SubGlCode, @FromDate=@FromDate, @ToDate=@ToDate, @isMainType=@isMainType');
        res.json(result.recordset || result.recordsets?.[0] || []);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 4. Summary Report Print - Details
exports.getSummaryDetails = async (req, res) => {
    try {
        const { pfmonth, ptmonth, PFDT, PTDT, pfyear, ptyear, pat, BRCD, isMainType } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0;
        const pool = await poolPromise;
        const queryStr = `
            SET NOCOUNT ON;
            SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
            EXEC SP_OFFICEACCSTATUS_R @pfmonth='${pfmonth}', @ptmonth='${ptmonth}', @PFDT='${PFDT}', @PTDT='${PTDT}', @pfyear='${pfyear}', @ptyear='${ptyear}', @pat='${pat}', @BRCD='${BRCD}', @isMainType='${isMainType}';
        `;
        const rows = await runStreamingSP(pool, queryStr);
        if (limit > 0) {
            const start = (page - 1) * limit;
            const paged = rows.slice(start, start + limit);
            res.json({ total: rows.length, page, limit, data: paged });
        } else {
            res.json({ total: rows.length, data: rows });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 5. Summary Report Print - Day Wise
exports.getSummaryDayWise = async (req, res) => {
    try {
        const { pfmonth, ptmonth, PFDT, PTDT, pfyear, ptyear, pat, BRCD, isMainType } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0;
        const pool = await poolPromise;
        const queryStr = `
            SET NOCOUNT ON;
            SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
            EXEC SP_OFFICEACCSTATUS_R @pfmonth='${pfmonth}', @ptmonth='${ptmonth}', @PFDT='${PFDT}', @PTDT='${PTDT}', @pfyear='${pfyear}', @ptyear='${ptyear}', @pat='${pat}', @BRCD='${BRCD}', @isMainType='${isMainType}';
        `;
        const rows = await runStreamingSP(pool, queryStr);
        if (limit > 0) {
            const start = (page - 1) * limit;
            const paged = rows.slice(start, start + limit);
            res.json({ total: rows.length, page, limit, data: paged });
        } else {
            res.json({ total: rows.length, data: rows });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 6. Summary Report Print - Month Wise
exports.getSummaryMonthWise = async (req, res) => {
    try {
        const { pfmonth, ptmonth, PFDT, PTDT, pfyear, ptyear, pat, BRCD, isMainType } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0;
        const pool = await poolPromise;
        const queryStr = `
            SET NOCOUNT ON;
            SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
            EXEC SP_OFFICEACCSTATUS_R @pfmonth='${pfmonth}', @ptmonth='${ptmonth}', @PFDT='${PFDT}', @PTDT='${PTDT}', @pfyear='${pfyear}', @ptyear='${ptyear}', @pat='${pat}', @BRCD='${BRCD}', @isMainType='${isMainType}';
        `;
        const rows = await runStreamingSP(pool, queryStr);
        if (limit > 0) {
            const start = (page - 1) * limit;
            const paged = rows.slice(start, start + limit);
            res.json({ total: rows.length, page, limit, data: paged });
        } else {
            res.json({ total: rows.length, data: rows });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
};
