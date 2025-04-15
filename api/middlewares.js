module.exports = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        req.body.createdAt = Date.now();
    }
    next();
}; 