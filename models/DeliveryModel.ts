import mongoose, { Schema, Model, Document } from "mongoose";

interface DeliveryDoc extends Document {
  fristName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  address:string;
  pincode: string;
  lat:number;//latitude of a location
  lng:number; //ongitude of a location
  isAvailable:boolean;
  verified:boolean;
}


const DeliverySchema = new Schema(
  {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    fristName: { type: String },
    lastName: { type: String},
    address:{ type: String},
    pincode: { type: String },
    lat:{ type: String },
    lng:{ type: String } ,
    isAvailable:{type:Boolean,required:true},
    verified:{type:Boolean,required:true}
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

const DeliveryModel = mongoose.model<DeliveryDoc>("Delivery", DeliverySchema);
export { DeliveryModel as Delivery };
