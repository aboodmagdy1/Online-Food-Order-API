import { Request, Response, NextFunction } from "express";
import { Vandor, Food } from "../models";
import { EditVandorInputs, VandorLoginInputs } from "../dto";
import { FindVandor } from "./AdminController";
import { GenerateSignature, validatePassword } from "../utility";
import { CreateFoodInputs } from "../dto/Food.dto";

//@desc  login
//@route POST /vandor/login
//@access private(vandor only)
export const VandorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VandorLoginInputs>req.body;

  const existingVandor = await FindVandor("", email);
  if (existingVandor !== null) {
    // validtion of password
    const validation = await validatePassword(
      password,
      existingVandor.password,
      existingVandor.salt
    );
    if (validation) {
      const signature = GenerateSignature({
        _id: existingVandor._id,
        name: existingVandor.name,
        email: existingVandor.email,
        foodTypes: existingVandor.foodType,
      });

      return res.json({ token: signature });
    } else {
      return res.json({ message: " Password is not valid " });
    }
  }
  return res.json({ message: "Login cerditianls are not valid " });
};

//@desc  get vandor profile
//@route GET /vandor/profile
//@access private(vandor only)
export const GetVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    console.log(user);
    const existingVandor = await FindVandor(user._id);
    return res.json(existingVandor);
  }

  return res.json({ message: "Vandor information not found" });
};

//@desc  update vandor profile
//@route PATCH /vandor/profile
//@access private(vandor only)
export const UpdateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, foodTypes, phone } = <EditVandorInputs>req.body;
  const user = req.user;

  if (user) {
    const existingVandor = await FindVandor(user._id);
    if (existingVandor !== null) {
      existingVandor.name = name;
      existingVandor.address = address;
      existingVandor.foodType = foodTypes;
      existingVandor.phone = phone;

      const savedResult = await existingVandor.save();
      return res.json(savedResult);
    }
  }

  return res.json({ message: "Vandor information not found" });
};

//@desc  update vandor services availabel or not
//@route PATCH /vandor/services
//@access private(vandor only)
export const UpdateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVandor = await FindVandor(user._id);
    if (existingVandor !== null) {
      existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
      const savedResult = await existingVandor.save();
      return res.json(savedResult);
    }
  }

  return res.json({ message: "Vandor information not found" });
};

//@desc  Vandor create food
//@route Post /vandor/Food
//@access private(vandor only)
export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const { name, price, description, foodType, readyTime, category } = <CreateFoodInputs>req.body;
    const vandor = await FindVandor(user._id);

    if (vandor !== null) {
      const createdFood = await Food.create({
        vandorId: vandor._id,
        name,
        description,
        foodType,
        category,
        readyTime,
        price,
        images: ["aaa.jpg"],
        rating: 0,
      });

      vandor.foods.push(createdFood);
      const result = await vandor.save();

      return res.json(result);
    }

  }

  return res.json({ message: "Something Went Worng When Add Food" });
};

//@desc  Vandor get all  foods
//@route Get /vandor/Foods
//@access private(vandor only)
export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({vandorId : user._id})
    if(foods !== null){
      return res.json(foods)
    }
  }

  return res.json({ message: "Foods information not found " });
};
