const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";


    if (Validator.isEmpty(data.email)) {
        errors.email = "邮箱不能为空！";
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = "邮箱格式有误！";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "密码不能为空！";
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "名字的长度不能小于2位并且不能大于30位";
    }




    return {
        errors,
        isValid: isEmpty(errors)
    }
}