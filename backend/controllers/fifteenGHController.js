const { sql, poolPromise } = require('../config/db');

// 15-G/H Submit Report (Direct Query on AVS5092)
exports.get15GHSubmitReport = async (req, res) => {
    const fromCustNo = req.query.fromCustNo || '1';
    const toCustNo   = req.query.toCustNo   || '999999999';
    const fromDate   = req.query.fromDate   || '';
    const toDate     = req.query.toDate     || '';
    const brcd       = req.query.brcd       || '';
    const mode       = req.query.mode       || 'json';

    if (!fromDate || !toDate) {
        return res.status(400).json({
            success: false,
            error: 'Missing required parameters. Required: fromDate, toDate',
        });
    }

    const parsedFromDate = new Date(fromDate);
    const parsedToDate   = new Date(toDate);
    if (isNaN(parsedFromDate.getTime()) || isNaN(parsedToDate.getTime())) {
        return res.status(400).json({ success: false, error: 'Invalid date format. Use YYYY-MM-DD.' });
    }
    if (parsedFromDate > parsedToDate) {
        return res.status(400).json({ success: false, error: 'fromDate cannot be after toDate.' });
    }

    try {
        const pool    = await poolPromise;
        const request = pool.request();

        request.input('FromCustNo', sql.VarChar(20), fromCustNo);
        request.input('ToCustNo',   sql.VarChar(20), toCustNo);
        request.input('FromDate',   sql.DateTime,    parsedFromDate);
        request.input('ToDate',     sql.DateTime,    parsedToDate);

        let query = `
            SELECT
                AV.CustNo,
                FormType,
                CONVERT(NVARCHAR(10), DateOfIssue,  103) AS IssueDate,
                CONVERT(NVARCHAR(10), DateOfSubmit, 103) AS SubmitDate,
                CONVERT(NVARCHAR(10), Entrydate,    103) AS Entrydate,
                AV.BRCD,
                U.USERNAME,
                M.CUSTNAME
            FROM AVS5092 AV
            LEFT JOIN UserMaster U
                ON AV.BRCD = U.BRCD AND AV.MID = U.PERMISSIONNO
            LEFT JOIN Master M
                ON M.CUSTNO = AV.CustNo
            WHERE
                AV.CUSTNO       BETWEEN @FromCustNo AND @ToCustNo
                AND AV.DateOfSubmit BETWEEN @FromDate   AND @ToDate
        `;

        if (brcd && brcd.trim() !== '' && brcd.trim() !== '0000') {
            request.input('Brcd', sql.VarChar(16), brcd.trim());
            query += ` AND AV.BRCD = @Brcd`;
        }

        query += ` ORDER BY AV.Entrydate`;

        console.log(`Executing 15-GH Submit Report: FromCustNo=${fromCustNo}, ToCustNo=${toCustNo}, FromDate=${fromDate}, ToDate=${toDate}, BRCD=${brcd || 'ALL'}`);

        const result = await request.query(query);
        const rows   = result.recordset || [];

        // TEXT mode
        if (mode === 'text') {
            if (rows.length === 0) {
                res.setHeader('Content-Type', 'text/plain');
                return res.send('No records found.');
            }

            const columns   = Object.keys(rows[0]);
            const colWidths = columns.map((col) =>
                Math.max(col.length, ...rows.map((r) => String(r[col] ?? '').length))
            );
            const separator = colWidths.map((w) => '-'.repeat(w + 2)).join('+');
            const header    = columns.map((col, i) => col.padEnd(colWidths[i])).join(' | ');
            const dataLines = rows.map((row) =>
                columns.map((col, i) => String(row[col] ?? '').padEnd(colWidths[i])).join(' | ')
            );

            const reportLines = [
                `15-G/H SUBMIT REPORT`,
                `From Date: ${fromDate}  To Date: ${toDate}`,
                `Customer Range: ${fromCustNo} to ${toCustNo}`,
                `Branch: ${brcd || 'ALL'}`,
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
            res.setHeader('Content-Disposition', `inline; filename="15GH_submit_report_${fromDate}_${toDate}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        // JSON mode
        return res.status(200).json({
            success:    true,
            parameters: { fromCustNo, toCustNo, fromDate, toDate, brcd: brcd || 'ALL' },
            rowCount:   rows.length,
            data:       rows,
        });

    } catch (err) {
        console.error('Error executing 15-GH Submit Report:', err);
        return res.status(500).json({ success: false, error: 'Database query execution failed', details: err.message });
    }
};
