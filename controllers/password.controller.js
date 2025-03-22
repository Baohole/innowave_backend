const Otp = require('../models/otp.model');
const User = require('../models/User')
const jwt = require('jsonwebtoken');

const createOtp = require('../helper/CreateOtp.helper');
const sendMail = require('../helper/SendMail.helper');

//[POST] /password/forgot
module.exports.Forgot = async (req, res) => {
    const email = req.body.email;
    const isExist = await User.findOne({
        email: email
    });
    if (!isExist) {
        return res.status(404).json({
            message: 'Email not found',
            status: 404
        });
    }
    const otp = createOtp(6);
    const data = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    }
    const newOTP = new Otp(data);
    await newOTP.save();

    const subject = 'Mã OTP xác minh mật khẩu';
    const message = `
            Mã OTP của bạn là: <b>${otp}</b>
            Vui lòng không để lộ mã này.`;
    sendMail(email, subject, message);
    return res.status(200).json({
        message: 'OTP đã được gửi đến email của bạn',
        status: 200
    });
}

//[POST] /password/otp
module.exports.Otp = async (req, res) => {
    const existOtp = await Otp.findOne({
        email: req.body.email,
        otp: req.body.otp,
    });
    if (!existOtp) {
        return res.status(404).json({
            message: 'Mã OTP không tồn tại',
            status: 404
        });
    }

    const user = await User.findOne({
        email: req.body.email
    });
    console.log(user)
    res.cookie('token', user.verificationToken);
    res.json({
        message: 'Otp chính xác',
        status: 200,
    })
}

//[POST] /password/reset
module.exports.ResetPassword = async (req, res) => {
    await User.updateOne({
        email: req.body.email
    }, {
        password: req.body.password
    });
    res.json({
        message: 'Đổi mật khẩu thành công',
        status: 200
    })
}