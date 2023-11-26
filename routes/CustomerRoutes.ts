import express, { Request, Response, NextFunction } from "express";
import {
  CustomerLogin,
  CustomerSignup,
  CustomerVerify,
  RequestOtp,
  GetCustomerProfile,
  UpdateCustomerProfile,
  GetOrders,
  GetOrderById,
  CreateOrder,
  AddToCart,
  GetCart,
  ClearCart,
} from "../controllers";
import { Authinticate } from "../middlewares";

const router = express.Router();

router.post("/signup", CustomerSignup);
router.post("/login", CustomerLogin);

//authenticated
router.use(Authinticate);
router.patch("/verify", CustomerVerify);
router.get("/otp", RequestOtp);
router.route("/profile").get(GetCustomerProfile).patch(UpdateCustomerProfile);

//order
router.get("/orders", GetOrders);
router.get("/order/:id", GetOrderById);
router.post("/create-order", CreateOrder);

//cart : it's perpouse is to make the customer able to add products to cart and it's orders to be available on it's all devices
router.route("/cart").post(AddToCart).get(GetCart).delete(ClearCart);

export { router as CustomerRoute };
