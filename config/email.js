const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test the transporter connection
transporter.verify(function (error, success) {
  if (error) {
    console.log('Error verifying email configuration:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

module.exports = transporter;