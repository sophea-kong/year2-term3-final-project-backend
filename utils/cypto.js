import crypto from 'crypto'


const ALGORITHM = "aes-256-gcm";
const encryptionKey = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const rawKey = Buffer.from(encryptionKey, 'hex');
const KEY = rawKey.length > 32 ? rawKey.subarray(0, 32) : rawKey;

export function encrypt(text){
    if (!text) return null;
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM,KEY,iv);

    let encrypted = cipher.update(text,'utf8','hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}


export function decrypt(encryptedText) {                                                                                                                                   
    if (!encryptedText) return null;                                                                                                                                         
    const [ivHex, authTagHex, encryptedData] = encryptedText.split(':');                                                                                                     
                                                                                                                                                                            
    const iv = Buffer.from(ivHex, 'hex');                                                                                                                                    
    const authTag = Buffer.from(authTagHex, 'hex');                                                                                                                          
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);                                                                                                            
                                                                                                                                                                            
    decipher.setAuthTag(authTag);                                                                                                                                            
                                                                                                                                                                            
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');                                                                                                           
    decrypted += decipher.final('utf8');                                                                                                                                     
                                                                                                                                                                            
    return decrypted;                                                                                                                                                        
}  
