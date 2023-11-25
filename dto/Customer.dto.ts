import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateCustomerInputs {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(8, 12)
  password: string;
}
export class CustomerLoginInputs {
  @IsEmail()
  email: string;

  @Length(8, 12)
  password : string
}

export class EditCustomerProfileInputs {
  @Length(6,12)
  fristName :string ;


  @Length(6,12)
  lastName : string ;
  

  @Length(6,12)
  address : string ; 
}

export class OrderInputs{
 _id : string;

 unit: number
}
export interface CustomerPayload {
  _id : string;
  email: string;
  verified:boolean ;


}

