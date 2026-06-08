const { sql, poolPromise } = require('../config/db');

// Button 1: "Show" — Exec SP_ProfitAndLoss (as on date show)
exports.show = async (req, res) => {
    try {
        const { branchCode, asOnDate } = req.query;

        if (!branchCode || !asOnDate) {
            return res.status(400).json({ error: "Please provide branchCode and asOnDate query parameters" });
        }

        // Derive month and year from the asOnDate (expected format: YYYY-MM-DD)
        const dateObj = new Date(asOnDate);
        const pfMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
        const pfYear = String(dateObj.getFullYear());

        const pool = await poolPromise;
        const result = await pool.request()
            .input('BRCD', sql.VarChar, branchCode)
            .input('PFMONTH', sql.VarChar, pfMonth)
            .input('PFYEAR', sql.VarChar, pfYear)
            .input('FromDate', sql.VarChar, asOnDate)
            .execute('SP_ProfitAndLoss');

        if (result.recordsets && result.recordsets.length > 1) {
            res.json({ recordsets: result.recordsets });
        } else {
            res.json(result.recordset || result.recordsets[0] || []);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Button 2: "Profit Loss Report" — Exec SP_LOGDETAILS (log insert) then SP_ProfitAndLoss
exports.profitLossReport = async (req, res) => {
    try {
        const { branchCode, asOnDate, vid, mid } = req.query;

        if (!branchCode || !asOnDate) {
            return res.status(400).json({ error: "Please provide branchCode and asOnDate query parameters" });
        }

        const dateObj = new Date(asOnDate);
        const pfMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
        const pfYear = String(dateObj.getFullYear());

        const pool = await poolPromise;

        // First: insert log entry
        await pool.request()
            .input('flag', sql.VarChar, 'Insert')
            .input('BRCD', sql.VarChar, branchCode)
            .input('VID', sql.VarChar, vid || '2')
            .input('ACTIVITY', sql.VarChar, 'Profitandlossrpt_ROHI')
            .input('NEWVALUE', sql.VarChar, '00')
            .input('MID', sql.VarChar, mid || '2')
            .execute('SP_LOGDETAILS');

        // Second: fetch profit and loss report
        const result = await pool.request()
            .input('BRCD', sql.VarChar, branchCode)
            .input('PFMONTH', sql.VarChar, pfMonth)
            .input('PFYEAR', sql.VarChar, pfYear)
            .input('FromDate', sql.VarChar, asOnDate)
            .execute('SP_ProfitAndLoss');

        // Return all recordsets for structured report rendering
        if (result.recordsets && result.recordsets.length > 1) {
            res.json({ recordsets: result.recordsets });
        } else {
            res.json(result.recordset || result.recordsets[0] || []);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Button 3: "Text Report View" — Exec SP_ProfitAndLoss (as on date text report view)
exports.textReportView = async (req, res) => {
    try {
        const { branchCode, asOnDate } = req.query;

        if (!branchCode || !asOnDate) {
            return res.status(400).json({ error: "Please provide branchCode and asOnDate query parameters" });
        }

        const dateObj = new Date(asOnDate);
        const pfMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
        const pfYear = String(dateObj.getFullYear());

        const pool = await poolPromise;
        const result = await pool.request()
            .input('BRCD', sql.VarChar, branchCode)
            .input('PFMONTH', sql.VarChar, pfMonth)
            .input('PFYEAR', sql.VarChar, pfYear)
            .input('FromDate', sql.VarChar, asOnDate)
            .execute('SP_ProfitAndLoss');

        res.json(result.recordsets && result.recordsets.length > 1 ? { recordsets: result.recordsets } : (result.recordset || result.recordsets[0] || []));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Button 4: "Report With Working Day" — Exec SP_ProfitAndLoss_day
exports.reportWithWorkingDay = async (req, res) => {
    try {
        const { branchCode, asOnDate } = req.query;

        if (!branchCode || !asOnDate) {
            return res.status(400).json({ error: "Please provide branchCode and asOnDate query parameters" });
        }

        const dateObj = new Date(asOnDate);
        const pfMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
        const pfYear = String(dateObj.getFullYear());

        const pool = await poolPromise;
        const result = await pool.request()
            .input('BRCD', sql.VarChar, branchCode)
            .input('PFMONTH', sql.VarChar, pfMonth)
            .input('PFYEAR', sql.VarChar, pfYear)
            .input('FromDate', sql.VarChar, asOnDate)
            .execute('SP_ProfitAndLoss_day');

        if (result.recordsets && result.recordsets.length > 1) {
            res.json({ recordsets: result.recordsets });
        } else {
            res.json(result.recordset || result.recordsets[0] || []);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==================== N FORM PL ====================

// N Form PL — "Profit Loss Report" — Exec RptPNProfitAndLoss
exports.nFormProfitLossReport = async (req, res) => {
    try {
        const { branchCode, fromDate, toDate } = req.query;

        if (!branchCode || !fromDate || !toDate) {
            return res.status(400).json({ error: "Please provide branchCode, fromDate and toDate query parameters" });
        }

        // Derive month/year from dates
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);

        const plMonth = String(fromDateObj.getMonth() + 1).padStart(2, '0');
        const plYear = String(fromDateObj.getFullYear());
        const pfMonth = String(toDateObj.getMonth() + 1).padStart(2, '0');
        const pfYear = String(toDateObj.getFullYear());

        const pool = await poolPromise;
        const result = await pool.request()
            .input('BRCD', sql.VarChar, branchCode)
            .input('PFMONTH', sql.VarChar, pfMonth)
            .input('PFYEAR', sql.VarChar, pfYear)
            .input('FromDate', sql.VarChar, toDate)
            .input('PLMONTH', sql.VarChar, plMonth)
            .input('PLYEAR', sql.VarChar, plYear)
            .input('ToDate', sql.VarChar, fromDate)
            .execute('RptPNProfitAndLoss');

        res.json(result.recordset || result.recordsets[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// N Form PL — "Text Report View" — Exec RptPNProfitAndLoss
exports.nFormTextReportView = async (req, res) => {
    try {
        const { branchCode, fromDate, toDate } = req.query;

        if (!branchCode || !fromDate || !toDate) {
            return res.status(400).json({ error: "Please provide branchCode, fromDate and toDate query parameters" });
        }

        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);

        const plMonth = String(fromDateObj.getMonth() + 1).padStart(2, '0');
        const plYear = String(fromDateObj.getFullYear());
        const pfMonth = String(toDateObj.getMonth() + 1).padStart(2, '0');
        const pfYear = String(toDateObj.getFullYear());

        const pool = await poolPromise;
        const result = await pool.request()
            .input('BRCD', sql.VarChar, branchCode)
            .input('PFMONTH', sql.VarChar, pfMonth)
            .input('PFYEAR', sql.VarChar, pfYear)
            .input('FromDate', sql.VarChar, toDate)
            .input('PLMONTH', sql.VarChar, plMonth)
            .input('PLYEAR', sql.VarChar, plYear)
            .input('ToDate', sql.VarChar, fromDate)
            .execute('RptPNProfitAndLoss');

        res.json(result.recordset || result.recordsets[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==================== INCOME / EXPENDITURE ====================

// Income/Expenditure — "Profit Loss Report" — Exec RptIncomeExpReport
exports.incomeExpProfitLossReport = async (req, res) => {
    try {
        const { branchCode, fromDate, toDate } = req.query;

        if (!branchCode || !fromDate || !toDate) {
            return res.status(400).json({ error: "Please provide branchCode, fromDate and toDate query parameters" });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('BRCD', sql.VarChar, branchCode)
            .input('PFDT', sql.VarChar, fromDate)
            .input('PTDT', sql.VarChar, toDate)
            .execute('RptIncomeExpReport');

        res.json(result.recordset || result.recordsets[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Income/Expenditure — "Text Report View" — Exec RptIncomeExpReport
exports.incomeExpTextReportView = async (req, res) => {
    try {
        const { branchCode, fromDate, toDate } = req.query;

        if (!branchCode || !fromDate || !toDate) {
            return res.status(400).json({ error: "Please provide branchCode, fromDate and toDate query parameters" });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('BRCD', sql.VarChar, branchCode)
            .input('PFDT', sql.VarChar, fromDate)
            .input('PTDT', sql.VarChar, toDate)
            .execute('RptIncomeExpReport');

        res.json(result.recordset || result.recordsets[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Income/Expenditure — "Int Paid Report" — Exec RptIncomeExpReport_IntHead
exports.incomeExpIntPaidReport = async (req, res) => {
    try {
        const { branchCode, fromDate, toDate } = req.query;

        if (!branchCode || !fromDate || !toDate) {
            return res.status(400).json({ error: "Please provide branchCode, fromDate and toDate query parameters" });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('BRCD', sql.VarChar, branchCode)
            .input('PFDT', sql.VarChar, fromDate)
            .input('PTDT', sql.VarChar, toDate)
            .execute('RptIncomeExpReport_IntHead');

        res.json(result.recordset || result.recordsets[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ==================== ADMIN EXPENSES ====================

// Admin Expenses — "Profit Loss Report" — Exec ISP_AVS0106
exports.adminExpProfitLossReport = async (req, res) => {
    try {
        const { branchCode, fromDate, toDate } = req.query;

        if (!branchCode || !fromDate || !toDate) {
            return res.status(400).json({ error: "Please provide branchCode, fromDate and toDate query parameters" });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('BRCD', sql.VarChar, branchCode)
            .input('FromDate', sql.VarChar, fromDate)
            .input('ToDate', sql.VarChar, toDate)
            .execute('ISP_AVS0106');

        res.json(result.recordset || result.recordsets[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin Expenses — "Text Report View" — Exec ISP_AVS0106
exports.adminExpTextReportView = async (req, res) => {
    try {
        const { branchCode, fromDate, toDate } = req.query;

        if (!branchCode || !fromDate || !toDate) {
            return res.status(400).json({ error: "Please provide branchCode, fromDate and toDate query parameters" });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('BRCD', sql.VarChar, branchCode)
            .input('FromDate', sql.VarChar, fromDate)
            .input('ToDate', sql.VarChar, toDate)
            .execute('ISP_AVS0106');

        res.json(result.recordset || result.recordsets[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};