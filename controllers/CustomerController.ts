import express, { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import {
  CartItem,
  CreateCustomerInputs,
  CustomerLoginInputs,
  EditCustomerProfileInputs,
  OrderInputs,
} from "../dto";
import { validate } from "class-validator";
import {
  GenerateSalt,
  GeneratePassword,
  GenerateOtp,
  onRequestOTP,
  GenerateSignature,
  validatePassword,
} from "../utility";
import { Customer, DeliveryUser, Food, Offer, Vendor } from "../models";
import { Order } from "../models";
import { trace } from "console";
import { Transaction } from "../models/TransactionModel";

/**   --------------------- Signup , Login , Verify  ----------------------    **/

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
    orders: [],
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
) => {
  const loginInputs = plainToClass(CustomerLoginInputs, req.body); //  لي بحوله اصلا عشان الفاليديت علي الكلاس دا  بدل البودي
  const inputErrors = await validate(loginInputs, {
    validationError: { target: true },
  });

  if (inputErrors.length > 0) {
    return res.status(400).json(inputErrors);
  }

  const { email, password } = loginInputs;
  const customer = await Customer.findOne({ email: email });

  if (customer) {
    const validation = await validatePassword(
      password,
      customer.password,
      customer.salt
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: customer._id,
        email: customer.email,
        verified: customer.verified,
      });

      return res.status(201).json({
        token: signature,
        verified: customer.verified,
        email: customer.email,
      });
    }
  }
  return res.status(404).json({ message: "Login error " });
};

/**   --------------------- OTP ----------------------    **/

//@desc  request otp (the same idea of resend the otp )
//@route Get /customer/otp
//@access  protected
export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      const { otp, expiry } = GenerateOtp();
      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();
      await onRequestOTP(otp, profile.phone);

      return res
        .status(200)
        .json({ message: "OTP sent your registerd phone number" });
    }
  }

  return res.status(400).json({ message: "Error with Request otp" });
};

/**   --------------------- Profile ----------------------    **/

//@desc Get customer profile
//@route Get /customer/profile
//@access  protected
export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      return res.status(200).json(profile);
    }
  }

  return res.status(400).json({ message: "Error with get profile" });
};

//@desc Update customer profile
//@route patch /customer/profile
//@access  protected
export const UpdateCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);
  const profileErrors = await validate(profileInputs, {
    validationError: { target: true },
  });

  if (profileErrors.length > 0) {
    return res.status(400).json(profileErrors);
  }
  const { fristName, lastName, address } = profileInputs;
  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      profile.fristName = fristName;
      profile.lastName = lastName;
      profile.address = address;

      const result = await profile.save();
      return res.status(200).json(result);
    }
  }

  return res.status(400).json({ message: "Error with Update profile" });
};

/**   --------------------- Cart ----------------------    **/

//@desc create cart
//@route post /customer/cart
//@access  protected
export const AddToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    let cartItems = Array();
    const { _id, unit } = <CartItem>req.body;
    const food = await Food.findById(_id);
    if (food) {
      if (profile) {
        cartItems = profile.cart;

        //check for cart Items
        if (cartItems.length > 0) {
          // ckeck for item and update unit
          const existFoodItem = cartItems.filter(
            (item) => item.food._id.toString() === _id
          );

          // if the item is exist then update the unit
          if (existFoodItem.length > 0) {
            const index = cartItems.indexOf(existFoodItem[0]);
            if (unit > 0) {
              cartItems[index] = { food, unit };
            } else {
              cartItems.splice(index, 1); // to remove item from cart if unit = 0
            }
          } else {
            // if the item is not exist then add it to the cart
            cartItems.push({ food, unit });
          }
        } else {
          // If there is no any itme i the cart
          cartItems.push({ food, unit });
        }

        // update the cart in the database
        if (cartItems) {
          profile.cart = cartItems as any;
          const cartResult = await profile.save();
          return res.status(200).json(cartResult.cart);
        }
      }
    }
  }
  return res.status(400).json({ message: "Error adding to cart" });
};
//@desc get cart
//@route get /customer/cart
//@access  protected
export const GetCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    if (profile) {
      return res.status(200).json(profile.cart);
    }
  }
  return res.status(400).json({ message: "Error Getting Cart" });
};
//@desc clear cart
//@route delete /customer/cart
//@access  protected
export const ClearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile !== null) {
      profile.cart = [] as any;
      const cartResult = await profile.save();
      return res
        .status(200)
        .json({ message: "cart successfully cleared", cart: cartResult.cart });
    }
  }
  return res.status(400).json({ message: "Error Clearing Cart" });
};

/**   --------------------- Payments ----------------------    **/
//@desc pay and make transaction
//@route Get /customer/create-payment
//@access  protected
export const CreatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const { amount, paymentMode, offerId } = req.body;
  let totalAmount = Number(amount); // total cost

  // apply offer if exist
  if (offerId) {
    const appliedOffer = await Offer.findById(offerId);
    if (appliedOffer) {
      if (appliedOffer.isActice) {
        totalAmount = totalAmount - appliedOffer.offerAmount;
      }
    }
  }

  //perform payment geteway Charge Api call

  // Create record on transactions
  const transaction = await Transaction.create({
    customer: customer ? customer._id : null,
    vendorId: " ",
    orderId: " ",
    orderValue: totalAmount,
    offerUsed: offerId || "NA",
    status: "OPEN",
    paymentMode: paymentMode,
    paymentResponse: " payment is Cash On Delivery",
  });
  // return transaction id to client
  return res.status(200).json(transaction);
};

const validateTransaction = async (txnId: string) => {
  const currentTransaction = await Transaction.findById(txnId);
  if (currentTransaction) {
    if (currentTransaction.status.toLowerCase() !== "failed") {
      return { status: true, currentTransaction };
    }
  }
  return { status: false, currentTransaction };
};

/**   --------------------- Delivery Notification  ----------------------    **/

const assignOrderForDelivery = async (orderId: string, vendorId: string) => {
  // find the vendor
  const vendor = await Vendor.findById(vendorId);

  if (vendor) {
    const areaCode = vendor.pincode;
    const vendorLat = vendor.lat;
    const vendorLng = vendor.lng;

    // find the available delivery person
    const deliveryPerson = await DeliveryUser.find({
      pincode: areaCode,
      isAvailable: true,
      verified: true,
    });

    if (deliveryPerson.length>0) {
      // check the nearst delivery person and assign order to it
      // by api google maps ore any one

      const currentOrder = await Order.findById(orderId);
      if (currentOrder) {
        // update DeliveryID
        currentOrder.deliveryId =  deliveryPerson[0]._id
        const response = await currentOrder.save();
      }
    }
  }
};
/**   --------------------- Orders ----------------------    **/

//@desc create order
//@route Post /customer/create-order
//@access  protected
export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1) get the cuurent login customer
  const customer = req.user;
  const { txnId, amount, items } = <OrderInputs>req.body;

  if (customer) {
    //1) validate transaction
    const { status, currentTransaction } = await validateTransaction(txnId);
    if (!status) {
      return res.status(400).json({ message: "Error with creating order" });
    }

    const profile = await Customer.findById(customer._id);

    if (profile) {
      //2) create order Id (1000 - 8999)
      const orderId = `${Math.floor(Math.random() * 8999) + 1000}`;
      //3) grab order item from rquest [{id:... , unit :..}]
      const cart = <[CartItem]> req.body
      let cartItems = Array();
      let netAmount = 0.0;
      let vendorId;

      //4) Calculate order amount
      // get the food doc  for cart items to can use the price
      const foods = await Food.find()
        .where("_id")
        .in(items.map((item) => item._id));

      foods.map((food) => {
        items.map(({ _id, unit }) => {
          if (food._id == _id) {
            netAmount += food.price * unit; // calc the total order price
            vendorId = food.vendorId;
            cartItems.push({ food, unit });
          }
        });
      });
      //5) create order
      const currentOrder = await Order.create({
        orderID: orderId,
        vendorID: vendorId,
        items: cartItems,
        totalAmount: netAmount, // total without offers
        paidAmount: amount, // total amount after offers
        orderDate: new Date(),
        orderStatus: "Waiting",
        remarks: "",
        deliveryId: "",
        readyTime: 45,
      });

      //6) after the order is created update the transaction

        profile.cart = [] as any;
        profile.orders.push(currentOrder);

        if (currentTransaction) {
          currentTransaction.vendorId = currentOrder.vendorID;
          currentTransaction.status = "CONFIRMED";
          currentTransaction.orderId = orderId; // دا رقم الاوردر وليس ال اي دي بتاع الاوردر
          await currentTransaction.save();


          await assignOrderForDelivery(currentOrder._id, currentOrder.vendorID);
          const profileResponse = await profile.save()

  
          return res.status(200).json(profileResponse);
        }
      }
    }
  

  return res.status(400).json({ message: "Error Creating Order" });
};

//@desc Get all  orders
//@route Get /customer/orders
//@access  protected
export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("orders");
    if (profile) {
      return res.status(200).json(profile.orders);
    }
  }

  return res.status(400).json({ message: "Error Getting Orders" });
};

//@desc Get   order by id
//@route Get /customer/order/:id
//@access  protected
export const GetOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.food");
    return res.status(200).json(order);
  }
  return res.status(400).json({ message: "Error Getting order" });
};

//@desc verivy offer
//@route Get /customer/offers/:id
//@access  protected
export const VerifyOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const offerId = req.params.id;
  const customer = req.user;

  if (customer) {
    const appliedOffer = await Offer.findById(offerId);

    if (appliedOffer) {
      if (appliedOffer.promoType === "USER") {
        //apply this offer once for  current user
      } else {
        if (appliedOffer.isActice) {
          return res
            .status(200)
            .json({ message: "Offer is Valid", offer: appliedOffer });
        }
      }
    }
  }
};
