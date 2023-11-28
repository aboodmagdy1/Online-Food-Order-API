import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateDeliveryUserInputs {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(8, 12)
  password: string;

  @Length(3,12)
  fristName:string;

  @Length(3,12)
  lastName:string;


  @Length(6,24)
  address:string;


  @Length(4,12)
  pincode:string;
}
export class DeliveryLoginUserInputs {
  @IsEmail()
  email: string;

  @Length(8, 12)
  password : string
}

export class EditDeliveryUserProfileInputs {
  @Length(6,12)
  fristName :string ;


  @Length(6,12)
  lastName : string ;
  

  @Length(6,12)
  address : string ; 
}

export interface DeliveryPayload {
  _id : string;
  email: string;
  verified:boolean ;


}

