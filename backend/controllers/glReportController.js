const { sql, poolPromise } = require('../config/db');

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
