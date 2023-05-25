const express = require('express');
// const {isAdmin} = require('../helpers/auth');
const {isSigning,isAdmin} = require('../middlewares/auth');
const authCont = require('../controllers/auth');
const router = express.Router();

//register Router
router.post('/register',authCont.register);
router.post('/login',authCont.login);

router.get('/auth-check',isSigning,authCont.isLogin);

router.get('/admin-check',isSigning,isAdmin,(req,res)=>{
    return res.status(200).json({ok: true});
});

//module exports
module.exports = router;