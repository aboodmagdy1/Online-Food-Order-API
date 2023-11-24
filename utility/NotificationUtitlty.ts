import exp from "constants";

//OTP
export const GenerateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000); //6 digit otp
  let expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
  return { otp, expiry };
};

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
  const accountSid = "ACa3055973a4811477f75067b110d8f85c";
  const authToken = "ee359721e19c359c9e132fc07752ddb6";
  const client = require("twilio")(accountSid, authToken);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: "+14437013746",
    to: `+20${toPhoneNumber}`,
  });
  return response;
};
