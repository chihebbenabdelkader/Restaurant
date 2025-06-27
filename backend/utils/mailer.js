const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // Mailtrap host
  port: 2525,
  auth: {
    user: "6a09b82bcb0820",
    pass: "55b841fbb3bd7a",
  },
});

const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: '"Your App Name" <no-reply@yourapp.com>',
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error); // 👈 This logs the error
    return null; // or throw error if you want to handle it upstream
  }
};

module.exports = sendEmail;
