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
// 1. As On Date / Show
//    Exec SP_BALANCESNEW_201704_1 @FLAG='N', 8 params
// ============================================================
exports.asOnDateShow = async (req, res) => {
    const { PBRCD, PFMONTH, PFYEAR, PFDATE, PEMONTH, PEYEAR, PEDATE } = req.query;
    await executeSP(res, 'SP_BALANCESNEW_201704_1', [
        { name: 'FLAG', type: sql.VarChar, value: 'N' },
        { name: 'PBRCD', type: sql.VarChar, value: PBRCD },
        { name: 'PFMONTH', type: sql.VarChar, value: PFMONTH },
        { name: 'PFYEAR', type: sql.VarChar, value: PFYEAR },
        { name: 'PFDATE', type: sql.VarChar, value: PFDATE },
        { name: 'PEMONTH', type: sql.VarChar, value: PEMONTH },
        { name: 'PEYEAR', type: sql.VarChar, value: PEYEAR },
        { name: 'PEDATE', type: sql.VarChar, value: PEDATE }
    ]);
};

// ============================================================
// 2. As On Date / Balance Sheet Report
//    Exec SP_BALANCESNEW @FLAG='N', 5 params
// ============================================================
exports.asOnDateBalanceSheetReport = async (req, res) => {
    const { PBRCD, PFMONTH, PFYEAR, PFDATE } = req.query;
    await executeSP(res, 'SP_BALANCESNEW', [
        { name: 'FLAG', type: sql.VarChar, value: 'N' },
        { name: 'PBRCD', type: sql.VarChar, value: PBRCD },
        { name: 'PFMONTH', type: sql.VarChar, value: PFMONTH },
        { name: 'PFYEAR', type: sql.VarChar, value: PFYEAR },
        { name: 'PFDATE', type: sql.VarChar, value: PFDATE }
    ]);
};

// ============================================================
// 3. As On Date / Report with Working Day
//    Exec SP_BALANCESNEW_WORKINGDAY @FLAG='N', 5 params
// ============================================================
exports.asOnDateReportWithWorkingDay = async (req, res) => {
    const { PBRCD, PFMONTH, PFYEAR, PFDATE } = req.query;
    await executeSP(res, 'SP_BALANCESNEW_WORKINGDAY', [
        { name: 'FLAG', type: sql.VarChar, value: 'N' },
        { name: 'PBRCD', type: sql.VarChar, value: PBRCD },
        { name: 'PFMONTH', type: sql.VarChar, value: PFMONTH },
        { name: 'PFYEAR', type: sql.VarChar, value: PFYEAR },
        { name: 'PFDATE', type: sql.VarChar, value: PFDATE }
    ]);
};

// ============================================================
// 4. As On Date / Balance Sheet Summary
//    Exec SP_BALANCESNEW_SUM @FLAG='N', 5 params
// ============================================================
exports.asOnDateBalanceSheetSummary = async (req, res) => {
    const { PBRCD, PFMONTH, PFYEAR, PFDATE } = req.query;
    await executeSP(res, 'SP_BALANCESNEW_SUM', [
        { name: 'FLAG', type: sql.VarChar, value: 'N' },
        { name: 'PBRCD', type: sql.VarChar, value: PBRCD },
        { name: 'PFMONTH', type: sql.VarChar, value: PFMONTH },
        { name: 'PFYEAR', type: sql.VarChar, value: PFYEAR },
        { name: 'PFDATE', type: sql.VarChar, value: PFDATE }
    ]);
};

// ============================================================
// 5. N-Format / Show
//    Exec SP_NFormBS @FLAG='Y', 8 params
// ============================================================
exports.nFormatShow = async (req, res) => {
    const { PBRCD, PFMONTH, PFYEAR, PFDATE, PEMONTH, PEYEAR, PEDATE } = req.query;
    await executeSP(res, 'SP_NFormBS', [
        { name: 'FLAG', type: sql.VarChar, value: 'Y' },
        { name: 'PBRCD', type: sql.VarChar, value: PBRCD },
        { name: 'PFMONTH', type: sql.VarChar, value: PFMONTH },
        { name: 'PFYEAR', type: sql.VarChar, value: PFYEAR },
        { name: 'PFDATE', type: sql.VarChar, value: PFDATE },
        { name: 'PEMONTH', type: sql.VarChar, value: PEMONTH },
        { name: 'PEYEAR', type: sql.VarChar, value: PEYEAR },
        { name: 'PEDATE', type: sql.VarChar, value: PEDATE }
    ]);
};

// ============================================================
// 6. N-Format / Balance Sheet Report
//    Exec SP_BALANCESNEW_201704_1 @FLAG='N', 8 params
// ============================================================
exports.nFormatBalanceSheetReport = async (req, res) => {
    const { PBRCD, PFMONTH, PFYEAR, PFDATE, PEMONTH, PEYEAR, PEDATE } = req.query;
    await executeSP(res, 'SP_BALANCESNEW_201704_1', [
        { name: 'FLAG', type: sql.VarChar, value: 'N' },
        { name: 'PBRCD', type: sql.VarChar, value: PBRCD },
        { name: 'PFMONTH', type: sql.VarChar, value: PFMONTH },
        { name: 'PFYEAR', type: sql.VarChar, value: PFYEAR },
        { name: 'PFDATE', type: sql.VarChar, value: PFDATE },
        { name: 'PEMONTH', type: sql.VarChar, value: PEMONTH },
        { name: 'PEYEAR', type: sql.VarChar, value: PEYEAR },
        { name: 'PEDATE', type: sql.VarChar, value: PEDATE }
    ]);
};

// ============================================================
// 7. Marathi BS / Show
//    Exec SP_BALANCESNEW_201704_1 @FLAG='Y', 8 params
// ============================================================
exports.marathiBSShow = async (req, res) => {
    const { PBRCD, PFMONTH, PFYEAR, PFDATE, PEMONTH, PEYEAR, PEDATE } = req.query;
    await executeSP(res, 'SP_BALANCESNEW_201704_1', [
        { name: 'FLAG', type: sql.VarChar, value: 'Y' },
        { name: 'PBRCD', type: sql.VarChar, value: PBRCD },
        { name: 'PFMONTH', type: sql.VarChar, value: PFMONTH },
        { name: 'PFYEAR', type: sql.VarChar, value: PFYEAR },
        { name: 'PFDATE', type: sql.VarChar, value: PFDATE },
        { name: 'PEMONTH', type: sql.VarChar, value: PEMONTH },
        { name: 'PEYEAR', type: sql.VarChar, value: PEYEAR },
        { name: 'PEDATE', type: sql.VarChar, value: PEDATE }
    ]);
};

// ============================================================
// 8. Marathi BS / Balance Sheet Report
//    Exec SP_BALANCES_Marathi @FLAG='Y', 5 params
// ============================================================
exports.marathiBSBalanceSheetReport = async (req, res) => {
    const { PBRCD, PFMONTH, PFYEAR, PFDATE } = req.query;
    await executeSP(res, 'SP_BALANCES_Marathi', [
        { name: 'FLAG', type: sql.VarChar, value: 'Y' },
        { name: 'PBRCD', type: sql.VarChar, value: PBRCD },
        { name: 'PFMONTH', type: sql.VarChar, value: PFMONTH },
        { name: 'PFYEAR', type: sql.VarChar, value: PFYEAR },
        { name: 'PFDATE', type: sql.VarChar, value: PFDATE }
    ]);
};

// ============================================================
// 9. Marathi BS / Working Day
//    Exec SP_BALANCESNEW_WORKINGDAY @FLAG='Y', 5 params
// ============================================================
exports.marathiBSWorkingDay = async (req, res) => {
    const { PBRCD, PFMONTH, PFYEAR, PFDATE } = req.query;
    await executeSP(res, 'SP_BALANCESNEW_WORKINGDAY', [
        { name: 'FLAG', type: sql.VarChar, value: 'Y' },
        { name: 'PBRCD', type: sql.VarChar, value: PBRCD },
        { name: 'PFMONTH', type: sql.VarChar, value: PFMONTH },
        { name: 'PFYEAR', type: sql.VarChar, value: PFYEAR },
        { name: 'PFDATE', type: sql.VarChar, value: PFDATE }
    ]);
};

// ============================================================
// 10. N-Format Marathi BS / Show
//     Exec SP_NFormBS @FLAG='Y', 8 params
// ============================================================
exports.nFormatMarathiShow = async (req, res) => {
    const { PBRCD, PFMONTH, PFYEAR, PFDATE, PEMONTH, PEYEAR, PEDATE } = req.query;
    await executeSP(res, 'SP_NFormBS', [
        { name: 'FLAG', type: sql.VarChar, value: 'Y' },
        { name: 'PBRCD', type: sql.VarChar, value: PBRCD },
        { name: 'PFMONTH', type: sql.VarChar, value: PFMONTH },
        { name: 'PFYEAR', type: sql.VarChar, value: PFYEAR },
        { name: 'PFDATE', type: sql.VarChar, value: PFDATE },
        { name: 'PEMONTH', type: sql.VarChar, value: PEMONTH },
        { name: 'PEYEAR', type: sql.VarChar, value: PEYEAR },
        { name: 'PEDATE', type: sql.VarChar, value: PEDATE }
    ]);
};

// ============================================================
// 11. N-Format Marathi BS / Balance Sheet Report
//     Exec SP_NFormBS @FLAG='Y', 8 params
// ============================================================
exports.nFormatMarathiBalanceSheetReport = async (req, res) => {
    const { PBRCD, PFMONTH, PFYEAR, PFDATE, PEMONTH, PEYEAR, PEDATE } = req.query;
    await executeSP(res, 'SP_NFormBS', [
        { name: 'FLAG', type: sql.VarChar, value: 'Y' },
        { name: 'PBRCD', type: sql.VarChar, value: PBRCD },
        { name: 'PFMONTH', type: sql.VarChar, value: PFMONTH },
        { name: 'PFYEAR', type: sql.VarChar, value: PFYEAR },
        { name: 'PFDATE', type: sql.VarChar, value: PFDATE },
        { name: 'PEMONTH', type: sql.VarChar, value: PEMONTH },
        { name: 'PEYEAR', type: sql.VarChar, value: PEYEAR },
        { name: 'PEDATE', type: sql.VarChar, value: PEDATE }
    ]);
};
