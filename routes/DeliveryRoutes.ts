import express, { Request, Response, NextFunction } from "express";
import { Authinticate } from "../middlewares";
import { verify } from "crypto";
import { DeliveryUserLogin, DeliveryUserSignup, GetDeliveryUserProfile, UpdateDeliveryUserProfile, UpdateDeliveryUserStatus } from "../controllers/DeliveryController";
import { RequestOtp } from "../controllers";

const router = express.Router();

router.post("/signup", DeliveryUserSignup);
router.post("/login", DeliveryUserLogin);

//authenticated
router.use(Authinticate);

// change status (online,offline)
router.put('/change-status',UpdateDeliveryUserStatus)


// profile 
router.route("/profile").get(GetDeliveryUserProfile).patch(UpdateDeliveryUserProfile);


export { router as DeliveryRoute };
