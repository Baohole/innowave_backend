const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sendMail = require('../helper/SendMail.helper')

module.exports.Register = async (req, res) => {
    try {
        const { email, phone } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            const error = existingUser.email === email
                ? "Email đã được sử dụng"
                : "Số điện thoại đã được đăng ký";
            return res.status(400).json({ error });
        }

        const verificationToken = crypto.randomBytes(20).toString("hex");
        const verificationExpires = new Date(Date.now() + 86400000);
        const newUser = new User({
            ...req.body,
            verificationToken,
            verificationExpires
        });
        // console.log(newUser, req.body)
        await newUser.save();

        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const message = `      <h2>Xin chào!</h2>
      <p>Vui lòng click vào link sau để kích hoạt tài khoản:</p>
      <a href="${verificationUrl}" style="
        background: #007bff;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        display: inline-block;
        margin: 15px 0;
      ">Xác thực email</a>
      <p>Link có hiệu lực trong 24 giờ</p>
`
        sendMail(email, "Xác thực email - INNOWAVE", message);

        res.status(201).json({
            success: true,
            message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực."
        });

    } catch (err) {
        res.status(500).json({
            error: err.message || "Lỗi server: Vui lòng thử lại sau"
        });
    }
}

// Xác thực email
module.exports.VerfiyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        console.log("[DEBUG] Token nhận được:", token);

        // Tìm user theo token và thời hạn hợp lệ
        const user = await User.findOne({
            verificationToken: token,
            verificationExpires: { $gt: new Date() } // So sánh với thời gian hiện tại
        });

        if (!user) {
            console.log("[ERROR] Token không hợp lệ hoặc đã hết hạn");
            return res.redirect(`${process.env.FRONTEND_URL}/login?verifyError=Token không hợp lệ hoặc đã hết hạn`);
        }

        // Cập nhật trạng thái xác thực
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;

        await user.save();
        console.log("[DEBUG] Đã cập nhật isVerified thành true cho user:", user.email);

        // Redirect về trang login với thông báo thành công
        res.redirect(`${process.env.FRONTEND_URL}/login?verifySuccess=true`);
    } catch (err) {
        console.error("[ERROR] Lỗi xác thực:", err);
        res.redirect(`${process.env.FRONTEND_URL}/login?verifyError=Lỗi server`);
    }
}

// Đăng nhập
module.exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isValidPassword = (await bcrypt.compare(password, user.password));

        if (!user || !isValidPassword) {
            return res.status(401).json({ error: "Email hoặc mật khẩu không đúng" });
        }

        if (!user.isVerified) {
            return res.status(401).json({ error: "Vui lòng xác thực email trước khi đăng nhập" });
        }

        const token = jwt.sign({ userId: user._id, name: user.first_name }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ error: "Lỗi server" });
    }
}
