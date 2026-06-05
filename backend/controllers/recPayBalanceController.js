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
// 1. English
//    Exec RptRecPayCLBal @BRCD, @PFDT, @PTDT
// ============================================================
exports.english = async (req, res) => {
    const { BRCD, PFDT, PTDT } = req.query;
    await executeSP(res, 'RptRecPayCLBal', [
        { name: 'BRCD', type: sql.VarChar, value: BRCD },
        { name: 'PFDT', type: sql.VarChar, value: PFDT },
        { name: 'PTDT', type: sql.VarChar, value: PTDT }
    ]);
};

// ============================================================
// 2. Marathi
//    Exec RptRecPayCLBal_Marathi @BRCD, @PFDT, @PTDT
// ============================================================
exports.marathi = async (req, res) => {
    const { BRCD, PFDT, PTDT } = req.query;
    await executeSP(res, 'RptRecPayCLBal_Marathi', [
        { name: 'BRCD', type: sql.VarChar, value: BRCD },
        { name: 'PFDT', type: sql.VarChar, value: PFDT },
        { name: 'PTDT', type: sql.VarChar, value: PTDT }
    ]);
};

// ============================================================
// 3. Skip Data
//    Exec RptRecPayCLBal_SkipData @BRCD, @PFDT, @PTDT
// ============================================================
exports.skipData = async (req, res) => {
    const { BRCD, PFDT, PTDT } = req.query;
    await executeSP(res, 'RptRecPayCLBal_SkipData', [
        { name: 'BRCD', type: sql.VarChar, value: BRCD },
        { name: 'PFDT', type: sql.VarChar, value: PFDT },
        { name: 'PTDT', type: sql.VarChar, value: PTDT }
    ]);
};
