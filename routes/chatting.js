const express = require("express");
const router = express.Router();


router.get('/', (req, res) => {
    if(req.user) {res.render('chatting',{isLogin:"Logout"})}
    else{res.render('chatting',{isLogin:"Login"})}
});

module.exports = router;