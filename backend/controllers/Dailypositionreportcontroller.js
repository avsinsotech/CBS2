const { poolPromise, sql } = require('../config/db');

/**
 * GET /api/daily-position-report
 * Query params:
 *   amountUnit     – "In Thousand" | "In Lacs" | "In Crore"
 *   fromDate       – DD/MM/YYYY
 *   textReportName – string label (used only on frontend; not sent to SP)
 */
const getDailyPositionReport = async (req, res) => {
  const { amountUnit, fromDate } = req.query;

  if (!fromDate || !amountUnit) {
    return res.status(400).json({ error: 'fromDate and amountUnit are required.' });
  }

  const parts = fromDate.trim().split('/');
  if (parts.length !== 3) {
    return res.status(400).json({ error: 'fromDate must be DD/MM/YYYY.' });
  }
  let [dd, mm, yyyy] = parts;
  if (yyyy.length === 2) yyyy = '20' + yyyy;
  const isoDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;

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

  try {
    const pool    = await poolPromise;
    const request = pool.request();

    request.input('AsOnDate', sql.DateTime,   new Date(isoDate));
    request.input('Type',     sql.VarChar(16), String(typeValue));

    // const result = await request.execute('RptDailyPositionList');
const result = await request.execute('RptDailyPositionList_Prev');

    return res.status(200).json(result.recordset || []);
  } catch (err) {
    console.error('getDailyPositionReport error:', err);
    return res.status(500).json({ error: 'Database error.', details: err.message });
  }
};

module.exports = { getDailyPositionReport };