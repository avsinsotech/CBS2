const { sql, poolPromise } = require('../config/db');

const executeCdRatioReport = async (req, res, responseMode = 'json') => {
    try {
        const flag = req.body.flag || req.query.flag || 'CDR';
        const brcd = req.body.brcd || req.query.brcd || '1';
        const onDate = req.body.onDate || req.query.onDate || '2025-07-26';
        const flag1 = req.body.flag1 !== undefined ? req.body.flag1 : (req.query.flag1 !== undefined ? req.query.flag1 : '');

        const pool = await poolPromise;
        const result = await pool.request()
            .input('Flag', sql.VarChar(100), flag)
            .input('SFlag', sql.VarChar(100), null)
            .input('Brcd', sql.VarChar(10), brcd)
            .input('OnDate', sql.DateTime, new Date(onDate))
            .input('Flag1', sql.VarChar(100), flag1)
            .execute('ISP_AVS0104');

        const rows = result.recordset || result.recordsets[0] || [];

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
                `CD RATIO REPORT`,
                `As On Date: ${onDate}  Branch: ${brcd}  Type: ${flag1 === 'CD' ? 'Summary' : 'Details'}`,
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
            res.setHeader('Content-Disposition', `inline; filename="cd_ratio_report_${onDate}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        res.json({
            success: true,
            data: rows,
            message: 'CD Ratio Report retrieved successfully.'
        });

    } catch (err) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain');
            return res.send(`Error executing CD Ratio Report: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getCdRatioReport = (req, res) => executeCdRatioReport(req, res, 'json');
exports.getCdRatioTextReportView = (req, res) => executeCdRatioReport(req, res, 'text');
