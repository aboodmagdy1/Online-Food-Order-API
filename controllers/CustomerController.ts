import express, { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { CreateCustomerInputs } from "../dto/Customer.dto";
import { validate } from "class-validator";
import {
  GenerateSalt,
  GeneratePassword,
  GenerateOtp,
  onRequestOTP,
  GenerateSignature,
} from "../utility";
import { Customer } from "../models";



//@desc  Singup
//@route POST /customer/signup
//@access public
export const CustomerSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CreateCustomerInputs, req.body);
  const inputErrors = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, password, phone } = customerInputs;

  const existCustomer = await Customer.findOne({ email: email });

  if (existCustomer !== null) {
    return res
      .status(409)
      .json({ message: "Customer with this email already exists." });
  }

  const salt = await GenerateSalt();
  const customerPassword = await GeneratePassword(password, salt);
  const { otp, expiry } = GenerateOtp();

  const result = await Customer.create({
    email: email,
    password: customerPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    verified: false,
    address: "",
    fristName: "",
    lastName: "",
    lng: 0,
    lat: 0,
  });

  if (result) {
    //send otp to customer to verify the phone number
    await onRequestOTP(otp, phone);

    // gnereate signature of payload of jwt
    const signature = GenerateSignature({
      _id: result._id,
      email,
      verified: result.verified,
    });
    // send the result to client
    return res.status(200).json({
      token: signature,
      verified: result.verified,
      email: result.email,
    });
  }

  return res.status(400).json({ message: "Errro with signup" });
};


//@desc  verify customer phone number after he recived otp
//@route Patch /customer/verify
//@access  protected (after signup)
export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const updatedCustomerResponse = await profile.save();

        //generate the segnatuer
        const signature = GenerateSignature({
          _id: updatedCustomerResponse._id,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });


        return res.status(200).json({
          token: signature,
          verified: updatedCustomerResponse.verified,
          email: updatedCustomerResponse.email,
        });
      }
    }
  }
  return res.status(400).json({ message: "Errro with OTP validation" });

};


//@desc  Login
//@route POST /customer/login
//@access public 
export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};



//@desc  request otp
//@route Get /customer/otp
//@access  protected
export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};


//@desc Get customer profile
//@route Get /customer/profile
//@access  protected
export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};


//@desc Update customer profile
//@route patch /customer/profile
//@access  protected
export const UpdateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
