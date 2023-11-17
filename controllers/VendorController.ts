import { Request, Response, NextFunction } from "express";
import { Vendor, Food } from "../models";
import { EditVendorInputs, VendorLoginInputs } from "../dto";
import { FindVendor } from "./AdminController";
import { GenerateSignature, validatePassword } from "../utility";
import { CreateFoodInputs } from "../dto/Food.dto";

//@desc  login
//@route POST /vendor/login
//@access private(vendor only)
export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInputs>req.body;

  const existingVendor = await FindVendor("", email);
  if (existingVendor !== null) {
    // validtion of password
    const validation = await validatePassword(
      password,
      existingVendor.password,
      existingVendor.salt
    );
    if (validation) {
      const signature = GenerateSignature({
        _id: existingVendor._id,
        name: existingVendor.name,
        email: existingVendor.email,
        foodTypes: existingVendor.foodType,
      });

      return res.json({ token: signature });
    } else {
      return res.json({ message: " Password is not valid " });
    }
  }
  return res.json({ message: "Login cerditianls are not valid " });
};

//@desc  get vendor profile
//@route GET /vendor/profile
//@access private(vendor only)
export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    console.log(user);
    const existingVendor = await FindVendor(user._id);
    return res.json(existingVendor);
  }

  return res.json({ message: "Vendor information not found" });
};

//@desc  update vendor profile
//@route PATCH /Vendor/profile
//@access private(vendor only)
export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, foodTypes, phone } = <EditVendorInputs>req.body;
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor !== null) {
      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.foodType = foodTypes;
      existingVendor.phone = phone;

      const savedResult = await existingVendor.save();
      return res.json(savedResult);
    }
  }

  return res.json({ message: "Vendor information not found" });
};

//@desc  update vendor Cover Images
//@route PATCH /vendor/coverImage
//@access private(vendor only)
export const UpdateVendorCoverImages = async(req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (user) {
    const vendor = await FindVendor(user._id);
     const files = req.files as [Express.Multer.File]
     const images = files.map((file: Express.Multer.File) => file.filename);
    
    if (vendor !== null) {
      vendor.coverImages.push(...images) 

      const result = await vendor.save();
      return res.json(result);
    }

    return res.json({ message: "Error Adding Fodd" });
  }
}


//@desc  update vendor services availabel or not
//@route PATCH /vendor/services
//@access private(vendor only)
export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor !== null) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
      const savedResult = await existingVendor.save();
      return res.json(savedResult);
    }
  }

  return res.json({ message: "Vendor information not found" });
};

//@desc  Vendor create food
//@route Post /vendor/Food
//@access private(vendor only)
export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { name, price, foodType, readyTime, description, category } = <CreateFoodInputs>req.body;
  if (user) {
    const vendor = await FindVendor(user._id);
     const files = req.files as [Express.Multer.File]
     const images = files.map((file: Express.Multer.File) => file.filename);
    
    if (vendor !== null) {
      const food = await Food.create({
        vendor: vendor._id,
        name: name,
        description: description,
        foodType: foodType,
        price: price,
        readyTime: readyTime,
        category: category,
        rating: 0,
        images,
      });

      vendor.foods.push(food);
      const result = await vendor.save();
      return res.json(result);
    }

    return res.json({ message: "Error Adding Fodd" });
  }
};

//@desc  Vendor get all  foods
//@route Get /vendor/Foods
//@access private(vendor only)
export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vendorId: user._id });
    if (foods !== null) {
      return res.json(foods);
    }
  }

  return res.json({ message: "Foods information not found " });
};
