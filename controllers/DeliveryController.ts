import express, { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  GenerateSalt,
  GeneratePassword,
  GenerateOtp,
  onRequestOTP,
  GenerateSignature,
  validatePassword,
} from "../utility";
import { Delivery } from "../models";
import {
  CreateDeliveryUserInputs,
  DeliveryLoginUserInputs,
} from "../dto/Delivery.dto";

/**   --------------------- Signup , Login , Verify  ----------------------    **/

//@desc  Singup
//@route POST /Delivery/signup
//@access public
export const DeliveryUserSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliveryInputs = plainToClass(CreateDeliveryUserInputs, req.body);
  const inputErrors = await validate(deliveryInputs, {
    validationError: { target: true },
  });

  //check for input errors
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }
  const { email, password, fristName, lastName, pincode, address, phone } =
    deliveryInputs;

  const salt = await GenerateSalt();
  const deliveryPassword = await GeneratePassword(password, salt);

  //check if this user already exists
  const existingDeliveryUser = await Delivery.findOne({ email: email });
  if (existingDeliveryUser) {
    return res
      .status(409)
      .json({ message: "An delivery user with this email already exists" });
  }
  // if not exist create one
  const result = await Delivery.create({
    email,
    password: deliveryPassword,
    salt,
    phone,
    address,
    pincode,
    fristName,
    lastName,
    lat: 0,
    lng: 0,
    isAvailable: false,
    verified: false,
  });

  if (result) {
    const signauter = GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });

    return res.status(201).json({
      message: "Delivery user created successfully",
      verified: result.verified,
      token: signauter,
    });
  }

  return res.status(400).json({ message: "Error with creating delivery user" });
};

//@desc  Login
//@route POST /Delivery/login
//@access public
export const DeliveryUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const deliverUserLoginInputs = plainToClass(
    DeliveryLoginUserInputs,
    req.body
  );
  const inputErrors = await validate(deliverUserLoginInputs, {
    validationError: { target: true },
  });

  //check for input errors
  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, password } = deliverUserLoginInputs;

  //check if this user already exists with this email
  const deliveryUser = await Delivery.findOne({ email: email });

  if (deliveryUser) {
    //verify password
    const validation = await validatePassword(
      password,
      deliveryUser.password,
      deliveryUser.salt
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: deliveryUser._id,
        email: deliveryUser.email,
        verified: deliveryUser.verified,
      });


        return res.status(200).json({
            message: "Login successfully",
            verified: deliveryUser.verified,
            token: signature,
        });
    }
  }


  return res.status(401).json({ message: "Invalid credentials" });
};

/**   --------------------- Change Status  ----------------------    **/
//@desc  update status
//@route put /Delivery/change_status
//@access private
export const UpdateDeliveryUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

/**   --------------------- Profile ----------------------    **/

//@desc Get Delivery profile
//@route Get /Delivery/profile
//@access  protected
export const GetDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const delivery = req.user;
  if (delivery) {
    const deliveryProfile = await Delivery.findById(delivery._id);

    return res.status(200).json(deliveryProfile);
  }

  return res.status(404).json({ message: "Error Getting profile " });
};

//@desc Update Delivery profile
//@route patch /Delivery/profile
//@access  protected
export const UpdateDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(400).json({ message: "Error with Update profile" });
};
