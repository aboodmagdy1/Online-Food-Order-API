import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GenerateSalt, GeneratePassword } from "../utility";
import { Transaction } from "../models/TransactionModel";

// as a vactor to find Vendor with email or id in different cases 
export const FindVendor = async (id:string | undefined ,email?:string)=>{
  if(email){
    // when we try to create a new one 
    return await Vendor.findOne({email:email})
  }else{
    // when we try to find a Vendor by id
    return await Vendor.findById(id)
  }

}

//@desc admin create new Vendor
//@route POST /admin/Vendor
//@access private (admin only)
export const CreateVendor = async (
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
    address
  } = <CreateVendorInput>req.body;

  const existingVendor =  await FindVendor('',email)

  if (existingVendor !== null) {
    res.json({ message: "Vendor is exist already with this email " });
  }

  //generate salt
  const salt = await GenerateSalt();

  //encrypt password
  const userPassword = await GeneratePassword(password, salt);

  const createdVendor = await Vendor.create({
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
    foods:[],
    lat:0,
    lng:0

  });
  res.json(createdVendor);
};


//@desc admin get all Vendors
//@route GET /admin/vendors
//@access private (admin only)
export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const Vendors = await Vendor.find({});

  if (Vendors !== null) {
    return res.json(Vendors);
  }

  return res.json({ message: "Vendors data not available" });
};

//@desc admin get  vendor
//@route GET /admin/vendor/:id
//@access private (admin only)
export const GetVendorById =async  (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const VendorId = req.params.id;

  const vendor = await FindVendor(VendorId)

  if (vendor !== null) {
    return res.json(vendor);
  }

  return res.json({ message: "vendor data not available" });




};


//@desc admin  transactions
//@route GET /admin/transactions
//@access private (admin only)
export const GetTransactions =async  (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const transactions = await Transaction.find()

  if (transactions !== null) {
    return res.json(transactions);
  }

  return res.json({ message: "transactions data not available" });




};

//@desc admin get  specific transaction
//@route GET /admin/transaction/:id
//@access private (admin only)
export const GetTransactionById =async  (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const txnId = req.params.id;

  const transaction = await Transaction.findById(txnId)

  if (transaction !== null) {
    return res.json(transaction);
  }

  return res.json({ message: "transaction data not available" });




};


