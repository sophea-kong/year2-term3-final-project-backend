import fs from 'fs';
import path from 'path';

export function logger(req, res, next) {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const timestamp = new Date().toISOString();
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'Unknown IP';
        const logMessage = `[${timestamp}] [IP: ${ip}] ${req.method} ${req.originalUrl || req.url} - ${res.statusCode} (${duration}ms)\n`;
        
        // Log to console
        console.log(logMessage.trim());

        // Append to text file
        fs.appendFile(
            path.join(process.cwd(), 'system_activity.log'),
            logMessage,
            (err) => {
                if (err) console.error('Failed to write to log file:', err);
            }
        );
    });
    
    next();
}