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

const executeCrarReport = async (req, res, responseMode = 'json') => {
    try {
        const branchCode = req.body.branchCode || req.query.branchCode || '1';
        const asOnDateStr = convertToSqlDate(req.body.asOnDate || req.query.asOnDate);

        const pool = await poolPromise;
        const request = pool.request();
        request.timeout = 600000; // 10 minutes

        const result = await request
            .input('Flag', sql.VarChar(100), 'CRAR')
            .input('SFlag', sql.VarChar(100), null)
            .input('Brcd', sql.VarChar(10), branchCode)
            .input('OnDate', sql.DateTime, asOnDateStr ? new Date(asOnDateStr) : null)
            .execute('ISP_CRAR');

        const capitalFunds = result.recordsets[0] || [];
        const riskAssets = result.recordsets[1] || [];

        if (responseMode === 'text') {
            if (capitalFunds.length === 0 && riskAssets.length === 0) {
                res.setHeader('Content-Type', 'text/plain');
                return res.send('No records found.');
            }

            // Calculate totals
            const totalCapital = capitalFunds.length > 0 ? (capitalFunds[0].ctotal ?? 0) : 0;
            const totalRiskAssets = riskAssets.length > 0 ? (riskAssets[0].atotal ?? 0) : 0;
            const crarRatio = totalRiskAssets > 0 ? ((totalCapital / totalRiskAssets) * 100) : 0;

            const formatNum = (val) => {
                const num = parseFloat(val);
                return isNaN(num) ? '0.00' : num.toFixed(2);
            };

            const lines = [];
            lines.push('--------------------------------------------------------------------------------');
            lines.push('           SHIVRANA GRAMIN BIGARSHETI SAH. PATSANSTHA MARYADIT GHOTI            ');
            lines.push('--------------------------------------------------------------------------------');
            lines.push(`Report Name : Capital to Risk-Weighted Assets Ratio (CRAR) Report`);
            lines.push(`Branch Code : ${branchCode}  As On Date : ${asOnDateStr}`);
            lines.push(`Printed Date: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`);
            lines.push('--------------------------------------------------------------------------------');
            lines.push('');

            // Capital Funds Section
            lines.push('A. CAPITAL FUNDS (Tier-I & Tier-II Capital)');
            lines.push('+-------+--------------------------------------------------+--------------------+');
            lines.push('| Sr No | Description                                      |             Amount |');
            lines.push('+-------+--------------------------------------------------+--------------------+');
            capitalFunds.forEach(row => {
                const sr = String(row.srno ?? '').padStart(5);
                const desc = String(row.description ?? '').trim().padEnd(48);
                const amt = formatNum(row.amount).padStart(18);
                lines.push(`| ${sr} | ${desc} | ${amt} |`);
            });
            lines.push('+-------+--------------------------------------------------+--------------------+');
            lines.push(`| TOTAL CAPITAL FUNDS (A)                                  | ${formatNum(totalCapital).padStart(18)} |`);
            lines.push('+----------------------------------------------------------+--------------------+');
            lines.push('');

            // Risk Assets Section
            lines.push('B. RISK-WEIGHTED ASSETS & EXPOSURE');
            lines.push('+----+----------------------------+------------+-----------+------------+--------+----------------+');
            lines.push('| Sr | Description                |     Amount | Provision |    Net Amt | Risk % | Adjusted Value |');
            lines.push('+----+----------------------------+------------+-----------+------------+--------+----------------+');
            riskAssets.forEach(row => {
                const sr = String(row.srno ?? '').padStart(2);
                const desc = String(row.description ?? '').trim().padEnd(26);
                const amt = formatNum(row.amount).padStart(10);
                const prov = formatNum(row.provision).padStart(9);
                const net = formatNum(row.Amt).padStart(10);
                const risk = String(row.RiskWeight ?? '0').padStart(6);
                const adj = formatNum(row.Adjusted_Value).padStart(14);
                lines.push(`| ${sr} | ${desc} | ${amt} | ${prov} | ${net} | ${risk} | ${adj} |`);
            });
            lines.push('+----+----------------------------+------------+-----------+------------+--------+----------------+');
            lines.push(`| TOTAL RISK-WEIGHTED ASSETS (B)                                                 | ${formatNum(totalRiskAssets).padStart(14)} |`);
            lines.push('+--------------------------------------------------------------------------------+----------------+');
            lines.push('');

            // CRAR Summary Section
            lines.push('C. CRAR CALCULATION SUMMARY');
            lines.push('--------------------------------------------------------------------------------');
            lines.push(`1. Total Capital Funds (A)              : ${formatNum(totalCapital)}`);
            lines.push(`2. Total Risk-Weighted Assets (B)       : ${formatNum(totalRiskAssets)}`);
            lines.push(`3. Capital to Risk-Weighted Assets Ratio : ${crarRatio.toFixed(2)} %`);
            lines.push('--------------------------------------------------------------------------------');

            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.setHeader('Content-Disposition', `inline; filename="crar_report_${asOnDateStr}.txt"`);
            return res.send(lines.join('\n'));
        }

        res.json({
            success: true,
            data: {
                capitalFunds,
                riskAssets
            },
            message: 'CRAR Report retrieved successfully.'
        });

    } catch (err) {
        if (responseMode === 'text') {
            res.setHeader('Content-Type', 'text/plain');
            return res.send(`Error executing CRAR Report: ${err.message}`);
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getCrarReport = (req, res) => executeCrarReport(req, res, 'json');
exports.getCrarTextReport = (req, res) => executeCrarReport(req, res, 'text');
