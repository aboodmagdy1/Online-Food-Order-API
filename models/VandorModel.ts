import mongoose, { Schema, Model, Document } from "mongoose";
// the Vandor is like a resturant that provide services to the users
// interface IVandor extends Document
// دا شكل الدوك الي مستنيه يبقي في الموديل بتاعي
interface IVandor extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  //   foods: any;
  rating: number;
  coverImages: [string];
  serviceAvailable: boolean;
}

// string وليس String  لاحظ هنا ال
const VandorSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    coverImages: [{ type: String, required: true }],
    rating: { type: Number },
    // foods: [{ type: mongoose.Types.ObjectId, ref: "Food" }],
  },
  {
    toJSON: {
      // call JSON.stringify() on the returned object to make the doc object on specific shape before returned
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

// دا شكل الي مستنيه يبقي في الموديل بتاعي
const VandorModel = mongoose.model<IVandor>("Vandor", VandorSchema);

export { VandorModel as Vandor };
