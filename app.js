const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(Session);
const flash = require('connect-flash');
const PORT= process.env.PORT || 3000;

// routes
const indexRoute = require("./routes/index");
const chattingRoute = require("./routes/chatting");
const boardRoute = require("./routes/board");

// DB연결
let url =  "mongodb://localhost:27017/dalhav";
//let url = "mongodb://admin:iamadmin123@ds239936.mlab.com:39936/heroku_gm078sp6";
mongoose.connect(url, {useNewUrlParser: true});

// 뷰엔진 설정
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

//use
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

//세션
var store = new MongoDBStore({
    uri: url,
    collection: 'sessions'
});

store.on('error', function(error) {
    console.log(error);
});

app.use(Session({
    secret:'dalhav', //세션 암호화 key
    resave:false,//세션 재저장 여부
    saveUninitialized:true,
    rolling:true,//로그인 상태에서 페이지 이동 시마다 세션값 변경 여부
    cookie:{maxAge:1000*60*60},//유효시간
    store: store
}));
app.use(passport.initialize());
app.use(passport.session());



// use routes
app.use("/", indexRoute);
app.use("/board", boardRoute);
app.use("/chatting", chattingRoute);

//listen
app.listen(PORT, function () {
    console.log('Example app listening on port',PORT);
});