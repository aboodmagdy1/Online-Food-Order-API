import express, { Request, Response, NextFunction } from "express";
import { AddFood, GetFoods, VandorLogin } from "../controllers";
import {
  GetVandorProfile,
  UpdateVandorProfile,
  UpdateVandorService,
} from "../controllers";
import { Authinticate } from "../middlewares";

const router = express.Router();

// not register for vandor because the admin will create the vandor
router.post("/login", VandorLogin);

router.use(Authinticate);
router.get("/profile", GetVandorProfile);
router.patch("/profile", UpdateVandorProfile);
router.patch("/service", UpdateVandorService);

router.get("/foods", GetFoods);
router.post("/food", AddFood);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("hello from vandor");
});

export { router as VandorRoute };
