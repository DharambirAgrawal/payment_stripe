// Import nodemailer
import nodemailer from 'nodemailer';
import { AppError } from "../errors/AppError.js";
import asyncHandler from "express-async-handler";




const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false,  // Ignore certificate errors (if any)
  },
});

// Define email options

// [
//     {
//       filename: `Invoice-${invoiceData.invoiceNumber}.pdf`,
//       content: pdfBuffer,
//       contentType: 'application/pdf'
//     }
// ]
export const sendEmail=asyncHandler(async (TO,message,attachments)=>{
  const mailOptions = {
    from: process.env.EMAIL_USER,    // Sender address
    to: TO,     // List of recipients
    subject: message.subject,   // Subject line
    html: message.html
  };
  

  if(attachments)  mailOptions.attachments=attachments


  // Send email
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(new AppError('Error sending Email!', 500)); // Reject the promise with the error
      } else {
        console.log('Email sent: ' + info.response);
        resolve(info);  // Resolve the promise on success
      }
    });
  });
});
