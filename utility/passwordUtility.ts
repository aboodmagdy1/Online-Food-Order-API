import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { VendorPayload } from "../dto";
import { Request } from "express";
import { AuthPayload } from "../dto/Auth.dto";

// generate the salt to use it in hashing the password and validate it
export const GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  enterdPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GeneratePassword(enterdPassword, salt)) === savedPassword;
};

export const GenerateSignature = (payload: VendorPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as Secret, {
    expiresIn: "1d",
  });
};

//will add the payload as user property in the request instance
export const ValidateSignature = async (req: Request) => {
  const signature = req.get("Authorization"); // from the header
  if (signature) {
    const payload = jwt.verify(
      signature.split(" ")[1],
      process.env.JWT_SECRET as Secret
    ) as AuthPayload;
    req.user = payload; // to solve the error here i will edit the interface of Request
    return true;
  }

  return false;
};
