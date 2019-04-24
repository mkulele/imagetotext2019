const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const crypto = require("crypto");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var nodemailer = require('nodemailer');
var smtpTransporter=require('nodemailer-smtp-transport');

var smtpTransport = nodemailer.createTransport(smtpTransporter({
    service: 'Gmail',
    host:'smtp.gmail.com',
    auth: {
        user: 'dalha.vv@gmail.com',
        pass: 'dhwlrgksk51!'
    }
}));


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
    else{res.render('signup',{email:'',isLogin:"Login"})}
});


// signup user
router.post("/signup", (req, res, next) => {
    var key_one=crypto.randomBytes(256).toString('hex').substr(50, 5);
    var key_two=crypto.randomBytes(256).toString('base64').substr(50, 5);
    var key_for_verify=key_one+key_two;
    console.log(key_one);
    console.log("aa");
    console.log(key_two);

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
                    password: crypto.createHash('sha512').update(req.body.password).digest('base64'),
                    key_for_verify: key_for_verify
                });
                user
                    .save()
                    .then(result => {
                    console.log(result);

                    //이메일인증
                    var url = 'http://' + req.get('host')+'/confirmEmail'+'?key='+key_for_verify;

                    var mailOpt = {
                        from: 'dalha.vv@gmail.com',
                        to: user.email,
                        subject: '이메일 인증을 진행해주세요.',
                        html : '<h1>이메일 인증을 위해 URL을 클릭해주세요.</h1><br>'+url
                    };

                    smtpTransport.sendMail(mailOpt, function(err, res) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('email has been sent.');
                        }
                        smtpTransport.close();
                    });

                    res.send('<script type="text/javascript">alert("이메일을 확인하세요."); window.location="/"; </script>');
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
        User.findOne({email: email, password: crypto.createHash('sha512').update(password).digest('base64'),email_verified:true}, function(err, user){
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


//이메일 인증
router.get('/confirmEmail',function (req,res) {

    User.updateOne({key_for_verify:req.query.key},{$set:{email_verified:true}}, function(err,user){
        //에러처리
        if (err) {
            console.log(err);
        }
        //일치하는 key가 없으면
        else if(user.n==0){
            res.send('<script type="text/javascript">alert("Not verified"); window.location="/"; </script>');
        }
        //인증 성공
        else {
            res.send('<script type="text/javascript">alert("Successfully verified"); window.location="/"; </script>');
        }
    });
});

module.exports = router;