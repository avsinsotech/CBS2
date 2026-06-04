const { sql, poolPromise } = require('../config/db');

// Helper to execute a stored procedure with given params
async function executeSP(res, spName, params) {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        params.forEach(p => {
            request.input(p.name, p.type, p.value);
        });

        const result = await request.execute(spName);
        res.json(result.recordset || result.recordsets?.[0] || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// ============================================================
// 1. Details / Report Print
//    Exec RptOfficeGLDetails @Brcd, @pat, @PFDT, @PTDT
// ============================================================
exports.details = async (req, res) => {
    const { Brcd, pat, PFDT, PTDT } = req.query;
    await executeSP(res, 'RptOfficeGLDetails', [
        { name: 'Brcd', type: sql.VarChar, value: Brcd },
        { name: 'pat', type: sql.VarChar, value: pat },
        { name: 'PFDT', type: sql.VarChar, value: PFDT },
        { name: 'PTDT', type: sql.VarChar, value: PTDT }
    ]);
};

// ============================================================
// 2. Details / Opening-Closing Details
//    Exec RptOfficeGLDetails_B @Brcd, @pat, @PFDT, @PTDT
// ============================================================
exports.detailsOpeningClosing = async (req, res) => {
    const { Brcd, pat, PFDT, PTDT } = req.query;
    await executeSP(res, 'RptOfficeGLDetails_B', [
        { name: 'Brcd', type: sql.VarChar, value: Brcd },
        { name: 'pat', type: sql.VarChar, value: pat },
        { name: 'PFDT', type: sql.VarChar, value: PFDT },
        { name: 'PTDT', type: sql.VarChar, value: PTDT }
    ]);
};

// ============================================================
// 3. DateWise
//    Exec RptBrWiseGLDetails @Brcd, @SubGlCode, @FromDate, @ToDate
// ============================================================
exports.dateWise = async (req, res) => {
    const { Brcd, SubGlCode, FromDate, ToDate } = req.query;
    await executeSP(res, 'RptBrWiseGLDetails', [
        { name: 'Brcd', type: sql.VarChar, value: Brcd },
        { name: 'SubGlCode', type: sql.VarChar, value: SubGlCode },
        { name: 'FromDate', type: sql.VarChar, value: FromDate },
        { name: 'ToDate', type: sql.VarChar, value: ToDate }
    ]);
};

// ============================================================
// 4. Summary
//    Exec Isp_AVS0010 @Brcd, @SubGlCode, @FromDate, @ToDate
// ============================================================
exports.summary = async (req, res) => {
    const { Brcd, SubGlCode, FromDate, ToDate } = req.query;
    await executeSP(res, 'Isp_AVS0010', [
        { name: 'Brcd', type: sql.VarChar, value: Brcd },
        { name: 'SubGlCode', type: sql.VarChar, value: SubGlCode },
        { name: 'FromDate', type: sql.VarChar, value: FromDate },
        { name: 'ToDate', type: sql.VarChar, value: ToDate }
    ]);
};
