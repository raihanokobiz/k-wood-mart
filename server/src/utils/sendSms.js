// import nodemailer from 'nodemailer';
// import config from '../config/config.js';

// export const transporter = nodemailer.createTransport({
//   service: config.smtpService,
//   auth: {
//     user: config.smtpUser,
//     pass: config.smtpPass
//   }
// });


// export const sendMail = async (mailOptions) => {
//   await transporter.sendMail(mailOptions);
// };

import config from '../config/config.js';

export const sendSMS = async (smsOptions) => {
  const messageType = 'text';
  const url = `${config.smsUrl}?api_key=${config.smsKey}&type=${messageType}&phone=${smsOptions.phoneNumber}&senderid=${config.smsSenderId}&message=${smsOptions.message}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle errors
    console.error('Error:', error.message);
    return { error: error.message };
  }
};
