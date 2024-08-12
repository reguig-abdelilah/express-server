const nodemailer = require('nodemailer'); // For Sending Mails

const SendMail = async (input)=>{
    
    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host:'smtp.mailgun.org',
        port:587,
        secure: false,
        auth: {
            user: 'reguigabdelilah@gmail.com',
            pass: 'wkiv twqt ggfx tpwu'
        }
    });
    const mailOptions = {
        from: 'reguigabdelilah@gmail.com',
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html
    };
    await transporter.sendMail(mailOptions);

   
}
module.exports = SendMail;