import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GenerateSalt, GeneratePassword } from "../utility";

// as a vactor to find vandor with email or id in different cases 
export const FindVandor = async (id:string | undefined ,email?:string)=>{
  if(email){
    // when we try to create a new one 
    return await Vandor.findOne({email:email})
  }else{
    // when we try to find a vandor by id
    return await Vandor.findById(id)
  }

}

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

  const existingVandor =  await FindVandor('',email)

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


//@desc admin get all vandors
//@route GET /admin/vandors
//@access private (admin only)
export const GetVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Vandors = await Vandor.find({});

  if (Vandors !== null) {
    return res.json(Vandors);
  }

  return res.json({ message: "Vandors data not available" });
};

//@desc admin get  vandor
//@route GET /admin/vandor/:id
//@access private (admin only)
export const GetVandorById =async  (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const VandorId = req.params.id;

  const vandor = await FindVandor(VandorId)

  if (vandor !== null) {
    return res.json(vandor);
  }

  return res.json({ message: "vandor data not available" });




};
