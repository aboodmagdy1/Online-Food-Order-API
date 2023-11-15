import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GenerateSalt, GeneratePassword } from "../utility";

//@desc admin create new vandor
//@route POST /admin/vandor
//@access private (admin only)
export const CreateVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    ownerName,
    pincode,
    foodType,
    email,
    password,
    phone,
    address,
  } = <CreateVandorInput>req.body;

  const existingVandor = await Vandor.findOne({ email: email });

  if (existingVandor !== null) {
    res.json({ message: "Vandor is exist already with this email " });
  }

  //generate salt
  const salt = await GenerateSalt();

  //encrypt password
  const userPassword = await GeneratePassword(password, salt);

  const createdVandor = await Vandor.create({
    name,
    address,
    pincode,
    foodType,
    email,
    password: userPassword,
    salt,
    ownerName,
    phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
  });
  res.json(createdVandor);
};

export const GetVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Vandors = await Vandor.find({});

  if (Vandors !== null) {
    res.json(Vandors);
  }

  res.json({ message: "Vandors data not available" });
};

export const GetVandorById =async  (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const VandorId = req.params.id;

  // const  = await Vandor.findById(VandorId);



};
