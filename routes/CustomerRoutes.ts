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
router.get('/orders',GetOrders)
router.get('/order/:id',GetOrderById)
router.post('/create-order',CreateOrder)

export { router as CustomerRoute };