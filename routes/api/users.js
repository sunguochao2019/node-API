const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jsonWebToken = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//引入验证
const Users = require('../../models/users');

//引入user
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
// $router GET api/users/test
router.get("/test", (req, res) => {
    res.json({ mes: "login works" })
})

// $router GET api/users/test
// 返回请求JSON数据
router.post("/register", (req, res) => {

    //console.log(req.body)
    const { errors, isValid } = validateRegisterInput(req.body)

    //判断isValid是否通过
    if (!isValid) {
        return res.status(400).json(errors);

    }

    //查询数据库中数据
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.status(400).json({
                    email: "邮箱已经被注册了"
                })
            } else {

                //头像
                var avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    phone: req.body.phone
                })

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        // Store hash in your password DB.
                        if (err) throw err
                        newUser.password = hash;

                        newUser.save()
                            .then(user => res.json(user))
                            .catch((err) => console.log(err))
                    });
                });
            }

        })
})

// $router POST api/users/login
// 返回token jwt passport
//  public

router.post("/login", (req, res) => {

    //console.log(req.body)
    const { errors, isValid } = validateLoginInput(req.body)

    //判断isValid是否通过
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    //用户查询
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ email: "用户不存在" })
            }

            //密码匹配
            bcrypt.compare(password, user.password)
                .then((isMactch) => {
                    if (isMactch) {

                        const rule = { id: user.id, name: user.name }
                        //jsonwebtoken.sign("规则", "加密名字", "过期时间"
                        jsonWebToken.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            if (err) throw err
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            })
                        })
                    } else {
                        return res.status(400).json({ password: "密码错误！" })
                    }
                })
        })
})

// $router get api/users/current
// 返回 current user
//  Private

router.get('/current', passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name
    })
})

module.exports = router;