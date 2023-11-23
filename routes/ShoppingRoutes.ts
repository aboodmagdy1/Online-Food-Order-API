import express from "express";
import {
  GetFoodAvailability,
  GetTopRestaurants,
  GetFoodIn30Min,
  SearchFoods,
  ResturantById,
} from "../controllers";

const router = express.Router();

//food Availability
router.get("/:pincode", GetFoodAvailability);

// Top Resturants
router.get("/top-restaurants/:pincode", GetTopRestaurants);

// Foods Available in 30 minutes
router.get("/foods-in-30-min/:pincode", GetFoodIn30Min);

// search food
router.get("/search/:pincode", SearchFoods);

// Find resturant by id
router.get("/restaurant/:id", ResturantById);

export { router as ShoppingRoute };
