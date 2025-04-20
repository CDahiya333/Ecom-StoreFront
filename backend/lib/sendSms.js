import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// SMS Sending Utility
// Will use Tiwilio for Demo purpose
// Could use SendGrid or Cheaper alternatives for Production
// Will think later about this

const sendSms = async (phone, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    console.log(
      `OTP Sent Successfully to: ${phone}, Message SID: ${message.sid}`
    );
    return { success: true, message: "OTP Sent Successfully" };
  } catch (error) {
    console.log({ success: false, message: error.message });
    throw error;
  }
};

export default sendSms;
