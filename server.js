const logEvents = require('./log-events');
const http = require('http');
const path = require('path');
const express = require('express');
const verifyJWT = require('./middleware/verifyjwt');
const cookieParser = require('cookie-parser');
const rolesList = require('./config/roleslist'); 
const verifyRoles = require('./middleware/verifyroles'); 
const PORT = process.env.PORT || 3500;
const app = express();

app.use(express.json()); // middleware for json parsing
app.use(cookieParser()); // middleware for cookies
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'views','index.html'));
})

app.use('/auth', require('./routes/api/auth'));


// app.use(verifyJWT);
app.get('/items', verifyJWT,(req,res)=>{
    res.json(
        [
            {username:'Abdelilah'},
            {username:'Rachida'},
            {username:'Imane'}
        ]
    );
});
// app.use(verifyRoles(rolesList.ADMIN, rolesList.EDITOR));
app.post('/items', verifyJWT, verifyRoles(rolesList.ADMIN, rolesList.EDITOR),(req,res)=>{
    res.json(req.body);
});
app.use('*', (req,res)=>{
    res.sendStatus(404)
});
app.listen(PORT, () => console.log(`Express running on port ${PORT}`));