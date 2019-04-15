const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const crypto = require("crypto");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.get('/', (req, res) => {
    if(req.user) {res.render('index',{email:req.user.email ,isLogin:"Logout"})}
    else{res.render('index',{email:'',isLogin:"Login"})}
});

router.get('/login', (req, res) => {
    if(req.user) {
        res.send('<script type="text/javascript">alert("이미 로그인 중입니다."); window.location="/"; </script>')
        //res.render('index',{email:req.user.email, isLogin:"Logout"})
    }
    else{res.render('login',{email:'',isLogin:"Login"})}
});

router.get('/signup', (req, res) => {
    if(req.user) {
        res.send('<script type="text/javascript">alert("이미 로그인 중입니다."); window.location="/"; </script>')
        //res.render('index',{email:req.user.email, isLogin:"Logout"})
    }
    else{res.render('login',{email:'',isLogin:"Login"})}
});


// signup user
router.post("/signup", (req, res, next) => {
    console.log(req.body);
    User.find({ email:req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.send('<script type="text/javascript">alert("이미 존재하는 이메일입니다."); window.location="/signup"; </script>');
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name:req.body.name,
                    email: req.body.email,
                    password: crypto.createHash('sha512').update(req.body.password).digest('base64')
                });
                user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.redirect("/");
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                  }
        });
});


//login user

//passport
//로그인에 성공할 시 serializeUser 메서드를 통해서 사용자 정보를 Session에 저장
passport.serializeUser(function (user, done) {
    done(null, user);
});

//사용자 인증 후 요청이 있을 때마다 호출
passport.deserializeUser(function (user, done) {
    done(null, user);
});


passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField : 'password',
        passReqToCallback : true//request callback 여부
    },
    function (req, email, password, done)
    {
        User.findOne({email: email, password: crypto.createHash('sha512').update(password).digest('base64')}, function(err, user){
            if (err) {
                throw err;
            } else if (!user) {
                return done(null, false, req.flash('login_message','일치안함')); // 로그인 실패 시 flash 메시지 처리
            } else {
                return done(null, user); // 로그인 성공이면 세션 처리 funtion으로 넘김
            }
        });
    }
));

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), // 인증 실패 시 '/login'으로 이동
    function (req, res) {
        res.redirect('/');
        //로그인 성공 시 '/'으로 이동
    });


//로그아웃
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;