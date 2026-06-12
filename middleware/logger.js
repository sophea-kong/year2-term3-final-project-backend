export function logger(req,res,next){
    console.log(`${Date.now() }${req.method} ${req.url} ${res.statuscode}`);
    next();
}