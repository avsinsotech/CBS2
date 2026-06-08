// const { poolPromise, sql } = require('../config/db');

/**
 * GET /api/br-wise-deposit-loan
 * Query params:
 *   asOnDate      – DD/MM/YYYY
 *   amountUnit    – "In Thousand" | "In Lacs" | "In Crore"
 *   branchCode    – branch code string
 */
const getBrWiseDepositLoan = async (req, res) => {
  const { asOnDate, amountUnit, branchCode } = req.query;

  /* ── Validation ─────────────────────────────────────────── */
  if (!asOnDate || !amountUnit || !branchCode) {
    return res.status(400).json({
      error: 'asOnDate, amountUnit and branchCode are required.',
    });
  }

  // Parse DD/MM/YYYY → YYYY-MM-DD
  const parts = asOnDate.trim().split('/');
  if (parts.length !== 3) {
    return res.status(400).json({ error: 'asOnDate must be DD/MM/YYYY.' });
  }
  let [dd, mm, yyyy] = parts;
  if (yyyy.length === 2) yyyy = '20' + yyyy;
  const isoDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;

  // Map label → divisor
  const typeMap = {
    'In Thousand': 1000,
    'In Lacs':     100000,
    'In Crore':    10000000,
  };
  const typeValue = typeMap[amountUnit];
  if (!typeValue) {
    return res.status(400).json({
      error: 'amountUnit must be "In Thousand", "In Lacs", or "In Crore".',
    });
  }

  /* ── Execute Stored Procedure ────────────────────────────── */
  try {
    const pool    = await poolPromise;
    const request = pool.request();

    request.input('AsOnDate',   sql.DateTime, new Date(isoDate));
    request.input('Type',       sql.VarChar(16), String(typeValue));
    request.input('brcd',       sql.VarChar(20), branchCode);

    const result = await request.execute('RptBrWiseDepositLoanList');

    const rows = result.recordset || [];
    return res.status(200).json(rows);
  } catch (err) {
    console.error('getBrWiseDepositLoan error:', err);
    return res.status(500).json({
      error: 'Database error.',
      details: err.message,
    });
  }
};

module.exports = { getBrWiseDepositLoan };