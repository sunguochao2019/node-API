const express = new require('express')
const mongoose = new require('mongoose')
const bodyParser = new require('body-parser')
const passport = new require('passport')
const app = express();


//引入user
const users = require('./routes/api/users');

//数据库配置
const db = require('./config/keys').mongoURI;

//使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(db)
    .then(() => {
        console.log("数据库连接成功！");
    })
    .catch(err => {
        console.log(`数据库连接失败${err}`);
    })

//passport 初始化
app.use(passport.initialize());
require("./config/passport")(passport);


//使用routes
app.use('/api/users', users);
const port = process.env.PORT || 3000;

// app.get('/', (req, res) => {
//     res.send('<h1>你好</h1>');
// })
app.listen(port, () => {
    console.log(`Server running in port http://localhost:${port}`);
})