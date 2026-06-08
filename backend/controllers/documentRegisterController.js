const { sql, poolPromise } = require('../config/db');

const convertToSqlDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            // DD/MM/YYYY -> YYYY-MM-DD
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
    }
    return dateStr;
};

const executeDocumentRegister = async (req, res, responseMode = 'json') => {
    try {
        const fromUploadDateStr = convertToSqlDate(req.body.fromUploadDate || req.query.fromUploadDate);
        const toUploadDateStr = convertToSqlDate(req.body.toUploadDate || req.query.toUploadDate);
        const fromDocCode = req.body.fromDocCode || req.query.fromDocCode;
        const toDocCode = req.body.toDocCode || req.query.toDocCode;

        const pool = await poolPromise;
        const request = pool.request();
        request.timeout = 600000; // 10 minutes

        let query = `
            SELECT IP.CUSTNO, IP.DOC_TYPE, IP.DOC_NO, IP.DOC_DATE, IP.SYS_DATE, IP.BRCD, M.CUSTNAME
            FROM IDENTITY_PROOF IP
            INNER JOIN MASTER M ON M.CUSTNO = IP.CUSTNO AND M.BRCD = IP.BRCD
            WHERE 1=1
        `;

        if (fromUploadDateStr) {
            query += ` AND IP.SYS_DATE >= @fromUploadDate`;
            request.input('fromUploadDate', sql.VarChar(20), fromUploadDateStr + ' 00:00:00');
        }
        if (toUploadDateStr) {
            query += ` AND IP.SYS_DATE <= @toUploadDateEnd`;
            request.input('toUploadDateEnd', sql.VarChar(20), toUploadDateStr + ' 23:59:59');
        }
        if (fromDocCode) {
            const fromVal = parseInt(fromDocCode, 10);
            if (!isNaN(fromVal)) {
                query += ` AND IP.DOC_TYPE >= @fromDocCode`;
                request.input('fromDocCode', sql.Int, fromVal);
            }
        }
        if (toDocCode) {
            const toVal = parseInt(toDocCode, 10);
            if (!isNaN(toVal)) {
                query += ` AND IP.DOC_TYPE <= @toDocCode`;
                request.input('toDocCode', sql.Int, toVal);
            }
        }

        query += ` ORDER BY IP.SYS_DATE DESC, IP.CUSTNO`;

        const result = await request.query(query);
        const rows = result.recordset || [];

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
                `DOCUMENT REGISTER REPORT`,
                `Upload Period: ${fromUploadDateStr || 'Start'} to ${toUploadDateStr || 'End'}`,
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
            res.setHeader('Content-Disposition', `inline; filename="document_register_${fromUploadDateStr || 'all'}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        res.json({
            success: true,
            data: rows,
            message: 'Document Register retrieved successfully.'
        });

    } catch (err) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain');
            return res.send(`Error executing Document Register: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getDocumentRegister = (req, res) => executeDocumentRegister(req, res, 'json');
exports.getDocumentRegisterText = (req, res) => executeDocumentRegister(req, res, 'text');
