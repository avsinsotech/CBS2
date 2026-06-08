const { sql, poolPromise } = require('../config/db');

const executeSiReport = async (req, res, responseMode = 'json') => {
    try {
        const flag = req.body.flag || req.query.flag || 'Report1';
        const brcd = req.body.brcd || req.query.brcd || '1';
        const fromDate = req.body.fromDate || req.query.fromDate || '2025-04-01';
        const toDate = req.body.toDate || req.query.toDate || '2026-03-30';

        const pool = await poolPromise;
        const result = await pool.request()
            .input('Flag', sql.VarChar(100), flag)
            .input('Brcd', sql.VarChar(100), brcd)
            .input('FDate', sql.VarChar(100), fromDate)
            .input('TDate', sql.VarChar(100), toDate)
            .execute('Isp_SI_DdsToLoan');

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
                `STANDING INSTRUCTION REPORT`,
                `From Date: ${fromDate}  To Date: ${toDate}  Branch: ${brcd}`,
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
            res.setHeader('Content-Disposition', `inline; filename="si_report_${fromDate}_to_${toDate}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        res.json({
            success: true,
            data: rows,
            message: 'SI Report retrieved successfully.'
        });

    } catch (err) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain');
            return res.send(`Error executing Standing Instruction Report: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getSiReport = (req, res) => executeSiReport(req, res, 'json');
exports.getSiTextReportView = (req, res) => executeSiReport(req, res, 'text');
