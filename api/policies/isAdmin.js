module.exports = async function (req, res, proceed) {
     if (req.session.userrole == 'admin') {
        return proceed(); 
    }
    return res.forbidden();
};