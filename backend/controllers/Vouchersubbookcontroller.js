// const sql = require('mssql');
// const dbConfig = require('../config/db');

// /**
//  * Get Voucher SubBook Report
//  * Calls RptVoucherDetailsList stored procedure
//  */
// const getVoucherSubBook = async (req, res) => {
//     try {
//         const { branchCode, fromDate, toDate, activityType } = req.query;

//         // Validation
//         if (!branchCode) {
//             return res.status(400).json({ error: 'Branch Code is required' });
//         }
//         if (!fromDate) {
//             return res.status(400).json({ error: 'From Date is required' });
//         }
//         if (!toDate) {
//             return res.status(400).json({ error: 'To Date is required' });
//         }
//         if (!activityType || activityType === '--Select--') {
//             return res.status(400).json({ error: 'Activity Type is required' });
//         }

//         // Parse dates from DD/MM/YYYY to proper DateTime format
//         const fromDateObj = parseDate(fromDate);
//         const toDateObj = parseDate(toDate);

//         if (!fromDateObj || !toDateObj) {
//             return res.status(400).json({ error: 'Invalid date format. Use DD/MM/YYYY' });
//         }

//         // Get database connection
//         const pool = new sql.ConnectionPool(dbConfig);
//         await pool.connect();

//         try {
//             // Execute stored procedure
//             const result = await pool
//                 .request()
//                 .input('BranchID', sql.VarChar(6), branchCode)
//                 .input('Fromdate', sql.DateTime, fromDateObj)
//                 .input('Todate', sql.DateTime, toDateObj)
//                 .input('Type', sql.VarChar(6), activityType)
//                 .execute('RptVoucherDetailsList');

//             // Close pool
//             await pool.close();

//             // Return results
//             if (result.recordsets && result.recordsets.length > 0) {
//                 res.status(200).json(result.recordsets[0]);
//             } else {
//                 res.status(200).json([]);
//             }
//         } catch (execError) {
//             await pool.close();
//             console.error('SP Execution Error:', execError);
//             res.status(500).json({ 
//                 error: 'Error executing stored procedure',
//                 details: execError.message 
//             });
//         }
//     } catch (error) {
//         console.error('Error in getVoucherSubBook:', error);
//         res.status(500).json({ 
//             error: 'Internal server error',
//             details: error.message 
//         });
//     }
// };

// /**
//  * Helper function to parse DD/MM/YYYY format to Date object
//  */
// const parseDate = (dateString) => {
//     try {
//         const parts = dateString.trim().split('/');
//         if (parts.length !== 3) return null;

//         let [day, month, year] = parts;
        
//         // Convert 2-digit year to 4-digit
//         if (year.length === 2) {
//             year = '20' + year;
//         }

//         // Create date object (YYYY-MM-DD)
//         const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//         const date = new Date(dateStr);

//         // Validate date
//         if (isNaN(date.getTime())) return null;

//         return date;
//     } catch (error) {
//         return null;
//     }
// };

// module.exports = {
//     getVoucherSubBook,
// };

const { sql, getPool } = require('../config/db');

/**
 * Get Voucher SubBook Report
 * Calls RptVoucherDetailsList stored procedure
 * Works with remote SQL Server and long-running queries
 */
const getVoucherSubBook = async (req, res) => {
    let pool;
    try {
        const { branchCode, fromDate, toDate, activityType } = req.query;

        console.log('📨 Request received:', { branchCode, fromDate, toDate, activityType });

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
        if (!toDate || !toDate.trim()) {
            return res.status(400).json({ error: 'To Date is required' });
        }
        if (!parseDate(toDate)) {
            return res.status(400).json({ error: 'To Date must be DD/MM/YYYY' });
        }
        if (!activityType || activityType === '--Select--') {
            return res.status(400).json({ error: 'Please select an Activity Type' });
        }

        // ─── Parse dates ──────────────────────────────────────────────────────
        const fromDateObj = parseDate(fromDate);
        const toDateObj = parseDate(toDate);

        console.log('📅 Dates parsed:', {
            fromDate: fromDate,
            fromDateParsed: fromDateObj,
            toDate: toDate,
            toDateParsed: toDateObj,
        });

        // ─── Get pool connection ───────────────────────────────────────────────
        console.log('🔌 Connecting to database pool...');
        pool = await getPool();
        console.log('✅ Pool connection established');

        // ─── Execute stored procedure ──────────────────────────────────────────
        console.log('⚙️  Executing RptVoucherDetailsList SP with:', {
            BranchID: branchCode,
            Fromdate: fromDateObj,
            Todate: toDateObj,
            Type: activityType,
        });

        const request = pool.request();
        request.input('BranchID', sql.VarChar(6), branchCode);
        request.input('Fromdate', sql.DateTime, fromDateObj);
        request.input('Todate', sql.DateTime, toDateObj);
        request.input('Type', sql.VarChar(6), activityType);

        const result = await request.execute('RptVoucherDetailsList');

        console.log('✅ SP executed successfully');
        console.log(`📊 Records found: ${result.recordset ? result.recordset.length : 0}`);

        // ─── Return results ───────────────────────────────────────────────────
        const data = result.recordset || [];
        res.status(200).json(data);

        if (data.length === 0) {
            console.log('⚠️  No records found for criteria');
        }

    } catch (error) {
        console.error('❌ Error in getVoucherSubBook:', error.message);
        console.error('Stack:', error.stack);

        // ─── Handle specific SQL errors ─────────────────────────────────────────
        if (error.message.includes('Could not find stored procedure')) {
            return res.status(500).json({
                error: 'Stored Procedure not found',
                details: 'RptVoucherDetailsList does not exist in database',
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
                details: 'Database query took too long. Try a smaller date range.',
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
    getVoucherSubBook,
};