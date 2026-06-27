export function logger(req, res, next) {
    const start = Date.now();
    
    // Listen for the response to finish before logging
    res.on('finish', () => {
        const duration = Date.now() - start;
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${req.method} ${req.originalUrl || req.url} - ${res.statusCode} (${duration}ms)`);
    });
    
    next();
}