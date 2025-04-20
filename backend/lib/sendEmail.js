import nodemailer from "nodemailer";

// EMAIL sending Utitlity
// GMAIL_USER: Store's Domain Email
// GMAIL_PASS: Created using Third party app access

const sendEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Your email verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 15px 0;">
            ${otp}
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `Email OTP sent successfully to: ${email}, Message ID: ${info.messageId}`
    );
    return { success: true, message: "Email OTP sent successfully" };
  } catch (error) {
    console.log("Error in sendEmail:", error.message);
    return { success: false, message: error.message };
  }
};

export default sendEmail;
