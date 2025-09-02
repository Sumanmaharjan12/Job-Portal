// utils/SendEmail.js

const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,              
      secure: false,           
      auth: {
        user: process.env.EMAIL_USER,   
        pass: process.env.EMAIL_PASS,   
      },
    });

    const mailOptions = {
      from: `"Job Nepal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = sendEmail;
