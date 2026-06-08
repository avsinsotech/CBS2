const { sql, poolPromise } = require('../config/db');

// Execute SP_ALLOK for a single branch or loop through range fromBranchID to toBranchID
const executeAllOkReport = async (req, res, responseMode = 'json') => {
    const fromBranch = req.query.fromBranchID || '';
    const toBranch = req.query.toBranchID || '';
    const asOnDate = req.query.asOnDate || '';
    const textFileName = req.query.textFileName || 'all_ok_report';

    if (!fromBranch || !toBranch || !asOnDate) {
        return res.status(400).json({
            success: false,
            error: 'Missing required parameters. Required: fromBranchID, toBranchID, asOnDate',
        });
    }

    const parsedAsOnDate = new Date(asOnDate);
    if (isNaN(parsedAsOnDate.getTime())) {
        return res.status(400).json({ success: false, error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    const startBranch = parseInt(fromBranch, 10);
    const endBranch = parseInt(toBranch, 10);

    if (isNaN(startBranch) || isNaN(endBranch)) {
        return res.status(400).json({ success: false, error: 'Branch IDs must be valid integers.' });
    }

    try {
        const pool = await poolPromise;
        let allData = [];

        // Loop through each branch code in the range
        for (let br = startBranch; br <= endBranch; br++) {
            const request = pool.request();
            // SP_ALLOK takes: @FYR, @FMONTH, @ASONDT, @BRCD
            request.input('FYR', sql.VarChar(5), null);
            request.input('FMONTH', sql.VarChar(5), null);
            request.input('ASONDT', sql.DateTime, parsedAsOnDate);
            request.input('BRCD', sql.Int, br);

            console.log(`Executing SP_ALLOK for branch ${br} with date ${asOnDate}`);
            const result = await request.execute('SP_ALLOK');
            const rows = result.recordset || [];
            
            // Add branch code column to rows if they exist to know which branch the data belongs to
            const rowsWithBranch = rows.map(row => ({
                BranchID: br,
                ...row
            }));
            
            allData = allData.concat(rowsWithBranch);
        }

        // TEXT mode
        if (responseMode === 'text') {
            if (allData.length === 0) {
                res.setHeader('Content-Type', 'text/plain');
                return res.send('No records found.');
            }

            const columns = Object.keys(allData[0]);
            const colWidths = columns.map((col) =>
                Math.max(col.length, ...allData.map((r) => String(r[col] ?? '').length))
            );

            const separator = colWidths.map((w) => '-'.repeat(w + 2)).join('+');
            const header    = columns.map((col, i) => col.padEnd(colWidths[i])).join(' | ');
            const dataLines = allData.map((row) =>
                columns.map((col, i) => String(row[col] ?? '').padEnd(colWidths[i])).join(' | ')
            );

            const reportLines = [
                `ALL OK REPORT`,
                `As On Date: ${asOnDate}  Branch Range: ${fromBranch} to ${toBranch}`,
                `Generated: ${new Date().toISOString()}`,
                `Total Records: ${allData.length}`,
                '',
                separator,
                header,
                separator,
                ...dataLines,
                separator,
            ];

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Content-Disposition', `inline; filename="${textFileName || 'all_ok_report'}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        // JSON mode
        return res.status(200).json({
            success: true,
            mode: 'json',
            parameters: { fromBranchID: fromBranch, toBranchID: toBranch, asOnDate, textFileName },
            rowCount: allData.length,
            data: allData,
        });

    } catch (err) {
        console.error('Error executing SP_ALLOK:', err);
        return res.status(500).json({ success: false, error: 'Database query execution failed', details: err.message });
    }
};

exports.getAllOkReport = (req, res) => executeAllOkReport(req, res, 'json');
exports.getAllOkTextReportView = (req, res) => executeAllOkReport(req, res, 'text');
