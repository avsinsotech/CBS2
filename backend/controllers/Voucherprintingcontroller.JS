const { sql, getPool } = require('../config/db');

/**
 * Get Voucher Printing Report
 * Calls either RptVoucherPrinting (DR) or RptVoucherPrintingCrDr (Transfer) stored procedures
 */
const getVoucherPrinting = async (req, res) => {
    let pool;
    try {
        const { branchCode, fromDate, setNo, reportType } = req.query;

        console.log('📨 Request received:', { branchCode, fromDate, setNo, reportType });

        // ─── Validation ────────────────────────────────────────────────────────
        if (!branchCode || !branchCode.trim()) {
            return res.status(400).json({ error: 'Branch Code is required' });
        }
        if (!fromDate || !fromDate.trim()) {
            return res.status(400).json({ error: 'From Date is required' });
        }
        if (!parseDate(fromDate)) {
            return res.status(400).json({ error: 'From Date must be DD/MM/YYYY' });
        }
        if (!reportType || (reportType !== 'dr' && reportType !== 'transfer')) {
            return res.status(400).json({ error: 'Invalid report type' });
        }

        // ─── Parse date ───────────────────────────────────────────────────────
        const dateObj = parseDate(fromDate);

        console.log('📅 Date parsed:', {
            fromDate: fromDate,
            dateParsed: dateObj,
            setNo: setNo || 'Not specified',
            reportType: reportType,
        });

        // ─── Get pool connection ───────────────────────────────────────────────
        console.log('🔌 Connecting to database pool...');
        pool = await getPool();
        console.log('✅ Pool connection established');

        // ─── Determine which SP to call ────────────────────────────────────────
        let spName;
        if (reportType.toLowerCase() === 'dr') {
            spName = 'RptVoucherPrinting';
        } else if (reportType.toLowerCase() === 'transfer') {
            spName = 'RptVoucherPrintingCrDr';
        }

        console.log('⚙️  Executing stored procedure:', spName);
        console.log('   Parameters:', {
            BranchID: branchCode,
            Date: dateObj,
            SetNo: setNo || null,
        });

        // ─── Execute stored procedure ──────────────────────────────────────────
        const request = pool.request();
        request.input('BranchID', sql.VarChar(6), branchCode);
        request.input('Date', sql.DateTime, dateObj);
        
        // SetNo is optional - only add if provided
        if (setNo && setNo.trim()) {
            request.input('SetNo', sql.VarChar(16), setNo.trim());
        } else {
            request.input('SetNo', sql.VarChar(16), null);
        }

        const result = await request.execute(spName);

        console.log('✅ SP executed successfully');
        console.log(`📊 Records found: ${result.recordset ? result.recordset.length : 0}`);

        // ─── Return results ───────────────────────────────────────────────────
        const data = result.recordset || [];
        res.status(200).json(data);

        if (data.length === 0) {
            console.log('⚠️  No records found for criteria');
        }

    } catch (error) {
        console.error('❌ Error in getVoucherPrinting:', error.message);
        console.error('Stack:', error.stack);

        // ─── Handle specific SQL errors ────────────────────────────────────────
        if (error.message.includes('Could not find stored procedure')) {
            return res.status(500).json({
                error: 'Stored Procedure not found',
                details: 'RptVoucherPrinting or RptVoucherPrintingCrDr does not exist',
                message: error.message,
            });
        }

        if (error.message.includes('Incorrect syntax')) {
            return res.status(500).json({
                error: 'SQL Syntax Error',
                details: 'Error executing stored procedure',
                message: error.message,
            });
        }

        if (error.message.includes('timeout') || error.message.includes('Timeout')) {
            return res.status(503).json({
                error: 'Request Timeout',
                details: 'Database query took too long',
                message: error.message,
            });
        }

        if (error.code === 'ECONN' || error.message.includes('connection')) {
            return res.status(503).json({
                error: 'Database Connection Failed',
                details: 'Unable to connect to database server',
                message: error.message,
            });
        }

        // ─── Generic error response ────────────────────────────────────────────
        res.status(500).json({
            error: 'Internal server error',
            details: error.message,
        });
    }
};

/**
 * Helper function to parse DD/MM/YYYY format to Date object
 * Supports 2-digit years (e.g., 25 becomes 2025)
 */
const parseDate = (dateString) => {
    try {
        if (!dateString) return null;

        const parts = dateString.trim().split('/');
        if (parts.length !== 3) {
            console.warn('❌ Invalid date format:', dateString);
            return null;
        }

        let [day, month, year] = parts;

        // Validate as numbers
        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            console.warn('❌ Non-numeric date parts:', { day, month, year });
            return null;
        }

        // Convert to integers
        day = parseInt(day);
        month = parseInt(month);
        year = parseInt(year);

        // Convert 2-digit year to 4-digit
        if (year < 100) {
            year = 2000 + year;
        }

        // Validate ranges
        if (month < 1 || month > 12) {
            console.warn('❌ Invalid month:', month);
            return null;
        }
        if (day < 1 || day > 31) {
            console.warn('❌ Invalid day:', day);
            return null;
        }

        // Create date object (YYYY-MM-DD format)
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dateObj = new Date(dateStr);

        // Validate date is valid
        if (isNaN(dateObj.getTime())) {
            console.warn('❌ Invalid date object:', dateStr);
            return null;
        }

        console.log(`📅 Date parsed: ${dateString} → ${dateStr}`);
        return dateObj;

    } catch (error) {
        console.error('❌ Error parsing date:', error.message);
        return null;
    }
};

module.exports = {
    getVoucherPrinting,
};