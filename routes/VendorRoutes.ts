import express, { Request, Response, NextFunction } from "express";
import { AddFood, AddOffer, EditOffer, GetCurrentOrders, GetFoods, GetOffers, GetOrderDetails, ProcessOrder, UpdateVendorCoverImages, VendorLogin } from "../controllers";
import {
  GetVendorProfile,
  UpdateVendorProfile,
  UpdateVendorService,
} from "../controllers";
import { Authinticate } from "../middlewares";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "_" + file.originalname);
  },
});

const images = multer({storage:imageStorage}).array("images",10)

const router = express.Router();

// not register for vendor because the admin will create the vendor
router.post("/login", VendorLogin);
router.use(Authinticate);
router.get("/profile", GetVendorProfile);
router.patch("/profile", UpdateVendorProfile);
router.patch("/coverImage",images, UpdateVendorCoverImages);
router.patch("/service", UpdateVendorService);
router.post("/food", images,AddFood);
router.get("/foods", GetFoods);

//orders
router.get('/orders',GetCurrentOrders)
router.get('/order/:id',GetOrderDetails)
router.put('/order/:id/process',ProcessOrder)

//offers 
router.get('/offers',GetOffers)
router.post('/offer',AddOffer)
router.put('/offer/:id',EditOffer)

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("hello from vendor");
});

export { router as VendorRoute };
