

const VerifyRoles = (...allowedRoles)=>{
    return (req, res, next)=>{
        if(!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        const result =  req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result) res.sendStatus(401);
        else next();

    };
}

module.exports = VerifyRoles;