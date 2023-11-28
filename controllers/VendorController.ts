import { Request, Response, NextFunction } from "express";
import { Vendor, Food, Offer, OfferDoc } from "../models";
import {
  EditVendorInputs,
  VendorLoginInputs,
  CreateFoodInputs,
  CreateOfferInputs,
} from "../dto";
import { FindVendor } from "./AdminController";
import { GenerateSignature, validatePassword } from "../utility";
import { Order } from "../models";

// -------------------------------- auth and profile  --------------------------------

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
export const UpdateVendorCoverImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const vendor = await FindVendor(user._id);
    const files = req.files as [Express.Multer.File];
    const images = files.map((file: Express.Multer.File) => file.filename);

    if (vendor !== null) {
      vendor.coverImages.push(...images);

      const result = await vendor.save();
      return res.json(result);
    }

    return res.json({ message: "Error Adding Fodd" });
  }
};

//@desc  update vendor services availabel or not and his address (lng,lat)
//@route PATCH /vendor/services
//@access private(vendor only)
export const UpdateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const {lng,lat} = req.body
  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor !== null) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable; // toggle service availibilty 
      if(lat&& lng){
        existingVendor.lat = lat 
        existingVendor.lng = lng
      }
      const savedResult = await existingVendor.save();
      return res.json(savedResult);
    }
  }

  return res.json({ message: "Vendor information not found" });
};

// -------------------------------- foods --------------------------------

//@desc  Vendor create food
//@route Post /vendor/Food
//@access private(vendor only)
export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { name, price, foodType, readyTime, description, category } = <
    CreateFoodInputs
  >req.body;
  if (user) {
    const vendor = await FindVendor(user._id);
    const files = req.files as [Express.Multer.File];
    const images = files.map((file: Express.Multer.File) => file.filename);

    if (vendor !== null) {
      const food = await Food.create({
        vendorId: vendor._id,
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

// -------------------------------- orders --------------------------------

//@desc  Vendor get Orders that recieved
//@route Get /vendor/orders
//@access private(vendor only)
export const GetCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user != null) {
    const orders = await Order.find({ vendorID: user._id }).populate(
      "items.food"
    );
    if (orders != null) {
      return res.status(200).json(orders);
    }
  }
  return res.status(400).json({
    message: "Error while getting orders",
  });
};
//@desc  Vendor specific order details
//@route Get /vendor/order/:id
//@access private(vendor only)
export const GetOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");
    if (order != null) {
      return res.status(200).json(order);
    }
  }
  return res.status(400).json({
    message: "Error while getting this order",
  });
};
//@desc  Vendor update order process (waiting , pending, completed,..)
//@route Get /vendor/order/:id/process
//@access private(vendor only)
export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  const { status, remarks, time } = req.body;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");
    if (order != null) {
      order.orderStatus = status;
      order.remarks = remarks;

      if (time) {
        order.readyTime = time;
      }

      const orderResult = await order.save();
      if (orderResult !== null) {
        return res.status(200).json(orderResult);
      }
    }
  }
  return res.status(400).json({
    message: "Error while process  this order",
  });
};

// -------------------------------- offers --------------------------------

//@desc  Vendor Get its offers
//@route Get /vendor/offers
//@access private(vendor only)
export const GetOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
   
    const offers = await Offer.find().populate("vendors")
    let currentOffers = Array()

    if(offers){

      offers.map(offer=>{
        if(offer.vendors){
          offer.vendors.map(vendor=>{
            if(vendor._id.toString() === user._id){
              currentOffers.push(offer)
            }
          })
        }

          // to push all offers that not created by vendors (by admin)
        if(offer.offerType === "GENIRIC"){
          currentOffers.push(offer)
        }

      })

      
    }
    return res.status(200).json(currentOffers)
  }
  return res.status(400).json({ message: "Error while getting offers" });
};
//@desc  Vendor add offer
//@route post /vendor/offer
//@access private(vendor only)
export const AddOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const {
      offerType,
      offerAmount,
      minAmount,
      bank,
      bins,
      promoType,
      promoCode,
      pincode,
      title,
      description,
      startValidity,
      endvalidity,
      isActice,
    } = <CreateOfferInputs>req.body;
    const vendor = await Vendor.findById(user._id);
    if (vendor) {
      const offer = await Offer.create({
        offerType,
        offerAmount,
        minAmount,
        vendors: [vendor],
        bank,
        bins,
        promoType,
        promoCode,
        pincode,
        title,
        description,
        startValidity,
        endvalidity,
        isActice,
      });

      return res.status(200).json(offer);
    }
  }
  return res.status(400).json({ message: "Error Createing Offer" });
};
//@desc  Vendor edit an offer
//@route put /vendor/offer/:id
//@access private(vendor only)
export const EditOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const offerId = req.params.id;

  if (user) {
    const {
      offerType,
      offerAmount,
      minAmount,
      bank,
      bins,
      promoType,
      promoCode,
      pincode,
      title,
      description,
      startValidity,
      endvalidity,
      isActice,
    } = <CreateOfferInputs>req.body;

    const currentOffer = await Offer.findById(offerId);
    if(currentOffer){
      const vendor = await Vendor.findById(user._id);
  
      if (vendor) {
      currentOffer.offerType = offerType
      currentOffer.offerAmount = offerAmount
      currentOffer.minAmount = minAmount
      currentOffer.bank = bank 
      currentOffer.bins = bins
      currentOffer.promoType= promoType
      currentOffer.promoCode= promoCode
      currentOffer.pincode= pincode
      currentOffer.title = title
      currentOffer.description= description
      currentOffer.startValidity = startValidity
      currentOffer.endvalidity= endvalidity
      currentOffer.isActice = isActice
        
        const updatedOffer = await currentOffer.save();

        return res.status(200).json(updatedOffer);
      }
    }

    }
  return res.status(400).json({ message: "Error Editing Offer" });

};
