import mongoose, { Schema, Model, Document } from "mongoose";
import { OrderDoc } from "./OrderModel";

interface CustomerDoc extends Document {
  fristName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  verified:boolean;
  otp:number;
  otp_expiry:Date;
  address:string;
  lat:number;//latitude of a location
  lng:number; //ongitude of a location
  orders: [OrderDoc];
  cart:[any]


}


const CustomerSchema = new Schema(
  {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    verified:{ type: Boolean, required: true },
    otp:{ type: Number, required: true },
    otp_expiry:{ type: Date, required: true },
    fristName: { type: String },
    lastName: { type: String},
    address:{ type: String},
    lat:{ type: String },
    lng:{ type: String } ,
    orders:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      }
    ]
    , cart: [
      {
        food : {type: mongoose.Schema.ObjectId, ref : "Food" , required: true},
         unit : {type: Number, required: true}
      }
    ]
  

  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const CustomerModel = mongoose.model<CustomerDoc>("Customer", CustomerSchema);
export { CustomerModel as Customer };
