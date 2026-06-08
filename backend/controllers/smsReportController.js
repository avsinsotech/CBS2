const { sql, poolPromise } = require('../config/db');

// Shared handler for SP_SMSMSTREPORT — used by both JSON and text endpoints
const executeSMSMasterReport = async (req, res, responseMode = 'json') => {
    const fdate  = req.query.fdate  || '';
    const tdate  = req.query.tdate  || '';
    const fbrcd  = req.query.fbrcd  || '';
    const tbrcd  = req.query.tbrcd  || '';
    const mobile = req.query.mobile || '0'; // '0' = All, number = Specific

    if (!fdate || !tdate || !fbrcd || !tbrcd) {
        return res.status(400).json({
            success: false,
            error: 'Missing required parameters. Required: fdate, tdate, fbrcd, tbrcd',
        });
    }

    const parsedFDate = new Date(fdate);
    const parsedTDate = new Date(tdate);
    if (isNaN(parsedFDate.getTime()) || isNaN(parsedTDate.getTime())) {
        return res.status(400).json({ success: false, error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    if (parsedFDate > parsedTDate) {
        return res.status(400).json({ success: false, error: 'fdate cannot be after tdate.' });
    }

    try {
        const pool    = await poolPromise;
        const request = pool.request();

        request.input('FDATE',  sql.DateTime,    parsedFDate);
        request.input('TDATE',  sql.DateTime,    parsedTDate);
        request.input('FBRCD',  sql.VarChar(16), fbrcd);
        request.input('TBRCD',  sql.VarChar(16), tbrcd);
        request.input('MOBILE', sql.VarChar(15), mobile);

        console.log(`[${responseMode.toUpperCase()}] SP_SMSMSTREPORT: FDATE=${fdate}, TDATE=${tdate}, FBRCD=${fbrcd}, TBRCD=${tbrcd}, MOBILE=${mobile}`);

        const result = await request.execute('SP_SMSMSTREPORT');
        const rows   = result.recordset || [];

        // TEXT mode: return plain-text formatted report
        if (responseMode === 'text') {
            if (rows.length === 0) {
                res.setHeader('Content-Type', 'text/plain');
                return res.send('No records found.');
            }

            const columns = Object.keys(rows[0]);
            const colWidths = columns.map((col) =>
                Math.max(col.length, ...rows.map((r) => String(r[col] ?? '').length))
            );

            const separator = colWidths.map((w) => '-'.repeat(w + 2)).join('+');
            const header    = columns.map((col, i) => col.padEnd(colWidths[i])).join(' | ');
            const dataLines = rows.map((row) =>
                columns.map((col, i) => String(row[col] ?? '').padEnd(colWidths[i])).join(' | ')
            );

            const reportLines = [
                `SMS MASTER REPORT`,
                `From: ${fdate}  To: ${tdate}  Branch: ${fbrcd} to ${tbrcd}  Mobile: ${mobile === '0' ? 'All' : mobile}`,
                `Generated: ${new Date().toISOString()}`,
                `Total Records: ${rows.length}`,
                '',
                separator,
                header,
                separator,
                ...dataLines,
                separator,
            ];

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Content-Disposition', `inline; filename="sms_report_${fdate}_${tdate}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        // JSON mode: return structured JSON
        return res.status(200).json({
            success:    true,
            mode:       'json',
            parameters: { fdate, tdate, fbrcd, tbrcd, mobile },
            rowCount:   rows.length,
            data:       rows,
        });

    } catch (err) {
        console.error('Error executing SP_SMSMSTREPORT:', err);
        return res.status(500).json({ success: false, error: 'Database query execution failed', details: err.message });
    }
};

// JSON response (Report button)
exports.getSmsMasterReport = (req, res) => executeSMSMasterReport(req, res, 'json');

// Plain-text response (Text Report View button)
exports.getSmsTextReportView = (req, res) => executeSMSMasterReport(req, res, 'text');
