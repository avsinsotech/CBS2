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
// 1. Report Print
//    Exec SP_OFFICEACCSTATUS_BrAdj @PFMONTH, @ptmonth,
//         @PFDT, @PTDT, @PFYEAR, @ptyear, @Brcd
// ============================================================
exports.reportPrint = async (req, res) => {
    const { PFMONTH, ptmonth, PFDT, PTDT, PFYEAR, ptyear, Brcd } = req.query;
    await executeSP(res, 'SP_OFFICEACCSTATUS_BrAdj', [
        { name: 'PFMONTH', type: sql.VarChar, value: PFMONTH },
        { name: 'ptmonth', type: sql.VarChar, value: ptmonth || req.query.PEMONTH },
        { name: 'PFDT', type: sql.VarChar, value: PFDT },
        { name: 'PTDT', type: sql.VarChar, value: PTDT },
        { name: 'PFYEAR', type: sql.VarChar, value: PFYEAR },
        { name: 'ptyear', type: sql.VarChar, value: ptyear || req.query.PEYEAR },
        { name: 'Brcd', type: sql.VarChar, value: Brcd }
    ]);
};

// ============================================================
// 2. Text Report View
//    Exec SP_OFFICEACCSTATUS_BrAdj @PFMONTH, @ptmonth,
//         @PFDT, @PTDT, @PFYEAR, @ptyear, @Brcd
// ============================================================
exports.textReportView = async (req, res) => {
    const { PFMONTH, ptmonth, PFDT, PTDT, PFYEAR, ptyear, Brcd } = req.query;
    await executeSP(res, 'SP_OFFICEACCSTATUS_BrAdj', [
        { name: 'PFMONTH', type: sql.VarChar, value: PFMONTH },
        { name: 'ptmonth', type: sql.VarChar, value: ptmonth || req.query.PEMONTH },
        { name: 'PFDT', type: sql.VarChar, value: PFDT },
        { name: 'PTDT', type: sql.VarChar, value: PTDT },
        { name: 'PFYEAR', type: sql.VarChar, value: PFYEAR },
        { name: 'ptyear', type: sql.VarChar, value: ptyear || req.query.PEYEAR },
        { name: 'Brcd', type: sql.VarChar, value: Brcd }
    ]);
};
