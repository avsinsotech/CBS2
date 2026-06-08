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

const executeBranchWiseDepositLoans = async (req, res, responseMode = 'json') => {
    try {
        const productType = req.body.productType || req.query.productType || 'Deposit';
        const unit = req.body.unit || req.query.unit || 'InThousand';
        const branchCode = req.body.branchCode || req.query.branchCode || '1';
        const asOnDate = formatDbDate(req.body.asOnDate || req.query.asOnDate || '2025-07-26');

        // Map productType to stored procedure
        let spName = 'Isp_AVS0033'; // Default to Deposit Summary
        if (productType === 'Loan') {
            spName = 'Isp_AVS0035'; // Loan Summary
        } else if (productType === 'LoanDetails') {
            spName = 'Isp_AVS0034'; // Loan Details
        } else if (productType === 'DepositDetails') {
            spName = 'Isp_AVS0032'; // Deposit Details
        }

        // Map unit to Type parameter
        let typeParam = '1000';
        if (unit === 'InLacs') {
            typeParam = '100000';
        } else if (unit === 'InCrore') {
            typeParam = '10000000';
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('BrCd', sql.VarChar(50), branchCode)
            .input('AsOnDate', sql.DateTime, asOnDate)
            .input('Type', sql.VarChar(50), typeParam)
            .execute(spName);

        const rows = result.recordset || result.recordsets[0] || [];

        if (responseMode === 'text') {
            if (rows.length === 0) {
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                return res.send('No records found for the specified criteria.');
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
                `BRANCH WISE DEPOSIT / LOANS REPORT (${productType.toUpperCase()})`,
                `As On Date: ${asOnDate}  Branch: ${branchCode}  Unit: ${unit}`,
                `Stored Procedure: ${spName}`,
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
            res.setHeader('Content-Disposition', `inline; filename="branchwise_${productType}_${asOnDate}.txt"`);
            return res.send(reportLines.join('\n'));
        }

        res.json({
            success: true,
            data: rows,
            message: 'Branch Wise Deposit/Loans Report retrieved successfully.'
        });

    } catch (err) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.send(`Error executing Branch Wise Deposit/Loans Report: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getBranchWiseDepositLoansReport = (req, res) => executeBranchWiseDepositLoans(req, res, 'json');
exports.getBranchWiseDepositLoansTextReport = (req, res) => executeBranchWiseDepositLoans(req, res, 'text');
