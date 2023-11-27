import { Request, Response, NextFunction } from "express";
import { Vendor, FoodDoc, Offer } from "../models";

// the pincode is the area code  to get the results based on it to be near to user

//@desc get  resturants that fooodservice is available for specific location
//@route Get /shopping/:pincode
//@access  puplic
export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    .sort({ rating: -1 })
    .populate("foods");

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(400).json({ message: "Data not found " });
};

//@desc get top resturants  in specific location
//@route Get /top-restaurants/:pincode
//access public
export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  })
    .sort({ rating: -1 })
    .limit(10);

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(400).json({ message: "Data not found " });
};

//@desc get food that ready time will be less than 30 minutes in specific location
//@route Get /foods-in-30-min/:pincode
//access public
export const GetFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];
    result.map((vendor) => {
      console.log(vendor.foods);
      const foods = vendor.foods as [FoodDoc];
      foodResult.push(...foods.filter((food) => food.readyTime < 30));
    });

    return res.status(200).json(foodResult);
  }
  return res.status(400).json({ message: "Data not found " });
};

//@desc get all food from specific location (if available or not )
//@route Get /search/:pincode
//access public
export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({
    pincode: pincode,
    serviceAvailable: false,
  }).populate("foods");

  if (result.length > 0) {
    let foodResult: any = [];
    result.map((vendor) => foodResult.push(...vendor.foods));
    return res.status(200).json(foodResult);
  }
  return res.status(400).json({ message: "Data not found " });
};

//@desc get resturant by id
//@route Get /resturant/:id
//@access public
export const ResturantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const result = await Vendor.findById(id).populate("foods");

  if (result) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: "Data not found" });
};


//@desc Get   offers  by pincode
//@route Get /customer/offers/:pincode
//@access  protected
export const GetAvailableOffers = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode;
  const offers = await Offer.find({pincode:pincode, isActice:true})

  if(offers){
    return res.status(200).json(offers);
  }
  return res.status(400).json({ message: "Error Getting offers" });
}