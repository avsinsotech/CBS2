const crypto = require('crypto');

function decrypt(cipherText) {
    const encryptionKey = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const salt = Buffer.from([0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76]);
    
    // Rfc2898DeriveBytes equivalent in Node.js
    // .NET default iterations for Rfc2898DeriveBytes is 1000
    // Key size 32 + IV size 16 = 48 bytes total
    const keyIV = crypto.pbkdf2Sync(encryptionKey, salt, 1000, 48, 'sha1');
    const key = keyIV.subarray(0, 32);
    const iv = keyIV.subarray(32, 48);

    const cipherBytes = Buffer.from(cipherText.replace(/ /g, '+'), 'base64');
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    
    let decrypted = decipher.update(cipherBytes);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    // .NET Encoding.Unicode is UTF-16LE
    return decrypted.toString('utf16le');
}

function encrypt(clearText) {
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

try {
    const cipherText = "iEmxT+Erd0AyJHhV0ShxSw==";
    const plain = decrypt(cipherText);
    console.log("Decrypted:", plain);
    
    const reEncrypted = encrypt(plain);
    console.log("Re-encrypted:", reEncrypted);
    console.log("Match:", cipherText === reEncrypted);
} catch (err) {
    console.error(err);
}
