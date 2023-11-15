import express, { Request, Response, NextFunction } from "express";
import { CreateVandor, GetVandorById, GetVandors } from "../controllers";

const router = express.Router();

router.post("/vandor", CreateVandor);
router.get('/vandors',GetVandors)
router.get('/vandors/:id',GetVandorById)


router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("hello from admin");
});


export { router as AdminRoute };
