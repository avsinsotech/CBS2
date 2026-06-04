const { sql, poolPromise } = require('../config/db');

// Helper to format date strings into YYYY-MM-DD format for SQL Server
const formatDbDate = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }
    return dateStr;
};

// Helper to format Date objects/strings to DD/MM/YYYY
const formatDate = (val) => {
    if (!val) return '';
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

const executeChairmanReport = async (req, res) => {
    try {
        const branchCode = req.query.branchCode || req.body.branchCode || '1';
        const asOnDate = formatDbDate(req.query.asOnDate || req.body.asOnDate || '2026-05-22');
        const responseMode = req.query.mode || req.body.mode || 'json';

        const pool = await poolPromise;
        const result = await pool.request()
            .input('BrCode', sql.VarChar(60), branchCode)
            .input('Asondate', sql.DateTime, new Date(asOnDate))
            .execute('RptChairmanReport_Yearly');

        const rows = result.recordset || result.recordsets[0] || [];

        // Format dates in the row cells for clean display
        const formattedRows = rows.map(row => {
            const newRow = {};
            for (const key of Object.keys(row)) {
                if (key.toLowerCase().startsWith('entrydate') && row[key]) {
                    newRow[key] = formatDate(row[key]);
                } else {
                    newRow[key] = row[key];
                }
            }
            return newRow;
        });

        if (responseMode === 'text' || responseMode === 'mis') {
            if (formattedRows.length === 0) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                return res.send('No records found for the specified criteria.');
            }

            const columns = Object.keys(formattedRows[0]);
            const colWidths = columns.map((col) =>
                Math.max(col.length, ...formattedRows.map((r) => String(r[col] ?? '').length))
            );

            const separator = colWidths.map((w) => '-'.repeat(w + 2)).join('+');
            const header    = columns.map((col, i) => col.padEnd(colWidths[i])).join(' | ');
            const dataLines = formattedRows.map((row) =>
                columns.map((col, i) => String(row[col] ?? '').padEnd(colWidths[i])).join(' | ')
            );

            const title = responseMode === 'mis' ? 'CHAIRMAN REPORT (MIS REG. OFFICE)' : 'CHAIRMAN REPORT';
            const reportLines = [
                title,
                `As On Date: ${asOnDate}  Branch Code: ${branchCode}`,
                `Generated: ${new Date().toLocaleString()}`,
                `Total Records: ${rows.length}`,
                '',
                separator,
                header,
                separator,
                ...dataLines,
                separator,
            ];

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            const filename = responseMode === 'mis' ? `chairman_report_mis_${asOnDate}.txt` : `chairman_report_${asOnDate}.txt`;
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            return res.send(reportLines.join('\n'));
        }

        // Default JSON response
        res.json({
            success: true,
            data: formattedRows,
            rowCount: formattedRows.length,
            parameters: {
                branchCode,
                asOnDate
            },
            message: 'Chairman Report retrieved successfully.'
        });

    } catch (err) {
        console.error('Error executing Chairman Report:', err);
        const errMsg = `Error executing Chairman Report: ${err.message}`;
        if (responseMode === 'text' || responseMode === 'mis') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.send(errMsg);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getChairmanReport = executeChairmanReport;
