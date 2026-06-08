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
// 1. ABR_ALR / Print
//    Exec Isp_AVS0029 @Brcd, @FisicalYear
// ============================================================
exports.abrAlrPrint = async (req, res) => {
    const { Brcd, FisicalYear } = req.query;
    await executeSP(res, 'Isp_AVS0029', [
        { name: 'Brcd', type: sql.VarChar, value: Brcd },
        { name: 'FisicalYear', type: sql.VarChar, value: FisicalYear }
    ]);
};

// ============================================================
// 2. ABR_ALR / Text Report View
//    Exec Isp_AVS0029 @Brcd, @FisicalYear
// ============================================================
exports.abrAlrTextReportView = async (req, res) => {
    const { Brcd, FisicalYear } = req.query;
    await executeSP(res, 'Isp_AVS0029', [
        { name: 'Brcd', type: sql.VarChar, value: Brcd },
        { name: 'FisicalYear', type: sql.VarChar, value: FisicalYear }
    ]);
};

// ============================================================
// 3. MIS Report / Print
//    Exec Isp_AVS0029 @Brcd, @FisicalYear
// ============================================================
exports.misReportPrint = async (req, res) => {
    const { Brcd, FisicalYear } = req.query;
    await executeSP(res, 'Isp_AVS0029', [
        { name: 'Brcd', type: sql.VarChar, value: Brcd },
        { name: 'FisicalYear', type: sql.VarChar, value: FisicalYear }
    ]);
};

// ============================================================
// 4. MIS Report / Text Report View
//    Exec Isp_AVS0029 @Brcd, @FisicalYear
// ============================================================
exports.misReportTextReportView = async (req, res) => {
    const { Brcd, FisicalYear } = req.query;
    await executeSP(res, 'Isp_AVS0029', [
        { name: 'Brcd', type: sql.VarChar, value: Brcd },
        { name: 'FisicalYear', type: sql.VarChar, value: FisicalYear }
    ]);
};

// ============================================================
// 5. MIS Report / MIS Report
//    Exec AVS_MISReport @Brcd, @PFMONTH, @PFYEAR, @PFDATE,
//                       @PEMONTH, @PEYEAR, @PEDATE
// ============================================================
exports.misReport = async (req, res) => {
    const { Brcd, PFMONTH, PFYEAR, PFDATE, PEMONTH, PEYEAR, PEDATE } = req.query;
    await executeSP(res, 'AVS_MISReport', [
        { name: 'Brcd', type: sql.VarChar, value: Brcd },
        { name: 'PFMONTH', type: sql.VarChar, value: PFMONTH },
        { name: 'PFYEAR', type: sql.VarChar, value: PFYEAR },
        { name: 'PFDATE', type: sql.VarChar, value: PFDATE },
        { name: 'PEMONTH', type: sql.VarChar, value: PEMONTH },
        { name: 'PEYEAR', type: sql.VarChar, value: PEYEAR },
        { name: 'PEDATE', type: sql.VarChar, value: PEDATE }
    ]);
};
