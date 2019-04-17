const express = require("express");
const router = express.Router();


router.get('/', (req, res) => {
    if(req.user) {res.render('board',{isLogin:"Logout"})}
    else{res.render('board',{isLogin:"Login"})}
});

module.exports = router;