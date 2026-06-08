const { sql, poolPromise } = require('../config/db');

// Lookup product name by subglcode and brcd from GLMAST
exports.getProductNameByCode = async (req, res) => {
    try {
        const { subglcode, brcd } = req.query;
        if (!subglcode || !brcd) {
            return res.status(400).json({ error: 'subglcode and brcd are required.' });
        }
        const pool = await poolPromise;
        const result = await pool.request()
            .input('subglcode', sql.VarChar, subglcode)
            .input('brcd', sql.VarChar, brcd)
            .query('SELECT GLNAME FROM GLMAST WHERE SUBGLCODE = @subglcode AND BRCD = @brcd');
        
        if (result.recordset.length > 0) {
            res.json({ GLNAME: result.recordset[0].GLNAME });
        } else {
            res.json({ GLNAME: '' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getGlReportForPrint = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT GLCODE, SUBGLCODE, GLGROUP, GLNAME, LASTNO 
                FROM GLMAST 
                WHERE BRCD = '1' 
                Order By GLCODE, SUBGLCODE, GLGROUP
            `);
        
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
