const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 587,
            secure:false,
            auth: {
                user:'94e5178bfc1934',
                pass:'e493bddeb22712',
            }
        });
 
        await transporter.sendMail({
            from:"akashpoovan983@gmail.com",
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;