const nodemailer = require('nodemailer');

module.exports = (reciever, subject, article) => {
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
    });

    const mailOptions = {
        from: `"INNOWAVE" <${process.env.SMTP_USER}>`,
        to: reciever,
        subject: subject,
        html: article
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            // do something useful
        }
    });
}