import { AuthPayload } from "../dto/Auth.dto";
import { NextFunction, Request, Response } from "express";
import { ValidateSignature } from "../utility";


// add a type to the Request interface
declare global{
    namespace Express{
        interface Request {
            user?:AuthPayload
        }
    }
}

// to check if the user is authenticated or not 
export const Authinticate = async (req: Request, res: Response,next :NextFunction) => {
    const validate = await ValidateSignature(req)

    if(validate){
        next()
    }else {
        res.json({"message":"user not authenticated"})
    }

}