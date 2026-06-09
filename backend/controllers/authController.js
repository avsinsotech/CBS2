const { sql, poolPromise } = require('../config/db');
const crypto = require('crypto');

function encryptPassword(clearText) {
    const encryptionKey = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const salt = Buffer.from([0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76]);
    
    const keyIV = crypto.pbkdf2Sync(encryptionKey, salt, 1000, 48, 'sha1');
    const key = keyIV.subarray(0, 32);
    const iv = keyIV.subarray(32, 48);

    const clearBytes = Buffer.from(clearText, 'utf16le');
    
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(clearBytes);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    return encrypted.toString('base64');
}

exports.login = async (req, res) => {
    try {
        const { loginCode, password, loginDate, brcd = '1' } = req.body;
        const ipAddress = req.ip || req.connection.remoteAddress || '127.0.0.1';

        if (!loginCode || !password) {
            return res.status(400).json({ error: 'LoginCode and Password are required' });
        }

        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        await transaction.begin();

        try {
            // 1. Check valid date
            const dateCheck = await transaction.request().query("select convert(varchar(10),getdate(),121) as sysDate where convert(varchar(10),getdate(),121)<'2050-01-01'");
            if (dateCheck.recordset.length === 0) {
                throw new Error("System date is invalid.");
            }

            // 2. Encrypt Password & Validate User credentials using ISP_UserLogin
            const encryptedPassword = encryptPassword(password);
            
            const loginReq = transaction.request();
            loginReq.input('UserId', sql.VarChar, loginCode);
            loginReq.input('PassWord', sql.VarChar, encryptedPassword);
            loginReq.input('Date1', sql.VarChar, loginDate || new Date().toISOString().split('T')[0]);
            const loginResult = await loginReq.execute('ISP_UserLogin');
            
            if (!loginResult.recordset || loginResult.recordset.length === 0) {
                throw new Error("Invalid response from login procedure.");
            }

            const loginData = loginResult.recordset[0];
            
            // If the procedure returned a failure flag (Flag !== '5' usually means success is 5)
            // Or if MSG exists and indicates an error
            if (loginData.Flag !== '5') {
                throw new Error(loginData.MSG || "Invalid username or password.");
            }
            
            // 3. Clear old sessions & Insert new session log
            // (Skipped locally as LoginLogs table does not exist in this environment)
            
            // 5. Update User Status & reset lock
            await transaction.request()
                .input('LoginCode', sql.VarChar, loginCode)
                .input('Password', sql.VarChar, encryptedPassword)
                .input('BRCD', sql.VarChar, brcd)
                .query("Update Usermaster SET UserStatus = '1' Where LoginCode = @LoginCode AND EPassword = @Password And BrCd = @BRCD");
                
            await transaction.request()
                .input('LoginCode', sql.VarChar, loginCode)
                .query("Update UserMaster Set AttemptCount = '0', IsLocked = '0', LockedTime = GetDate() Where LoginCode = @LoginCode");

            // Get User Info for attendance
            const userInfoResult = await transaction.request()
                .input('LoginCode', sql.VarChar, loginCode)
                .query("SELECT PERMISSIONNO, VERIFYID, UserName FROM USERMASTER WHERE LoginCode = @LoginCode");
            
            let mid = '8';
            let vid = '8';
            let userName = loginCode;
            if (userInfoResult.recordset.length > 0) {
                mid = userInfoResult.recordset[0].PERMISSIONNO || '8';
                vid = userInfoResult.recordset[0].VERIFYID || '8';
                userName = userInfoResult.recordset[0].UserName || loginCode;
            }

            // 6. Log Details
            try {
                await transaction.request()
                    .input('flag', sql.VarChar, 'Insert')
                    .input('BRCD', sql.VarChar, brcd)
                    .input('VID', sql.VarChar, vid)
                    .input('ACTIVITY', sql.VarChar, `Login_${loginCode}`)
                    .input('NEWVALUE', sql.VarChar, '00')
                    .input('MID', sql.VarChar, mid)
                    .execute('SP_LOGDETAILS');
            } catch (err) { /* ignore audit failure */ }

            // 7. Attendance
            try {
                const attCheck = await transaction.request()
                    .input('BRCD', sql.VarChar, brcd)
                    .input('MID', sql.VarChar, mid)
                    .query("SELECT TOP 1 FORMAT(ATDATE,'yyyy-MM-dd') as lastAtt FROM ATTENDANCE WHERE BRCD=@BRCD AND MID=@MID ORDER BY ID DESC");
                
                const today = new Date().toISOString().split('T')[0];
                if (attCheck.recordset.length === 0 || attCheck.recordset[0].lastAtt !== today) {
                    await transaction.request()
                        .input('BRCD', sql.VarChar, brcd)
                        .input('MID', sql.VarChar, mid)
                        .query("INSERT INTO ATTENDANCE(ATDATE,INTIME,STAGE,INSTATUS,BRCD,MID,ATSTATUS) VALUES(GETDATE(),CONVERT(VARCHAR(8), GETDATE(), 108) ,'1001','P',@BRCD,@MID,'P')");
                }
            } catch (err) { /* ignore attendance failure */ }

            // 8. Fetch Contextual Parameters (DayOpen, SessionTime, etc)
            const paramResult = await transaction.request()
                .input('BRCD', sql.VarChar, brcd)
                .query("Select ListField, ListValue From Parameter Where BrCd = @BRCD AND ListField IN ('DayOpen', 'AuthoIP', 'SessionTime', 'SI_EXEU')");
            
            const paramsMap = {};
            paramResult.recordset.forEach(p => {
                paramsMap[p.ListField] = p.ListValue;
            });

            // 9. Fetch Menu
            const menuResult = await transaction.request()
                .query("SELECT [MenuId], [ParentMenuId], [MenuTitle], [PageDesc], [PageUrl],[CssFont] FROM [AVS5016] WHERE [STATUS]=1 order by MenuId,ParentMenuId");

            // 10. Fetch Bank Info
            const bankInfoResult = await transaction.request()
                .input('BRCD', sql.VarChar, brcd)
                .query(`
                    select convert(varchar(100),main.BANKNAME)+'_'+convert(varchar(100),Bank.branchName) BANKNAME, main.BANKCD 
                    from (select bankname,BANKCD from Bankname where brcd=0) main,
                         (select MIDNAME branchName from Bankname where brcd=@BRCD) Bank 
                `);

            await transaction.commit();

            res.json({
                message: 'Login successful',
                user: {
                    loginCode: loginCode,
                    userName: userName,
                    branchCode: brcd,
                    verifyId: vid,
                    permissionNo: mid
                },
                parameters: paramsMap,
                bankInfo: bankInfoResult.recordset[0] || {},
                menus: menuResult.recordset
            });

        } catch (err) {
            await transaction.rollback();
            throw err;
        }

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: err.message || 'Login failed' });
    }
};
