// email

const nodemailer = require ('nodemailer');

const sendEmail= async({to,subject,html}) =>{
    const transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:process.env.Email_USER,
            pass:process.env.EMAIL_PASS,
        },
    });
    // Email option
    const mailOptions={
        from:`"Job Nepal"<${process.env.Email_USER}>`,
        to,
        subject,
        html,
    };
    await transporter.sendMail(mailOptions);
}
module.exports=sendEmail;