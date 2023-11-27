import mongoose, { Schema, Model, Document } from "mongoose";

export interface OrderDoc extends Document {
  orderID: string; // will appear for customer to keep track of order
  vendorID: string; // to knwo how many orders for specific vendor
  items: [any]; //[{food,unit}]
  totalAmount: number;
  paidAmount : number;
  orderDate: Date;
  orderStatus: string; // fro customer{watting, failed },for vendor { ACCEPT , REJECT , UNDER-PROCESS , READY }    remarks: string, // fro cancellation of order (vendor give a reason why order is canceled)
  remarks : string ;
  deliveryId: string; // to keep track of the delivery onway or not ..
  readyTime: number; // max 60 minutes
}

const OrderSchema = new Schema(
  {
    orderID: { type: String, required: true },
    vendorID: { type: String, required: true },
    items: [
      {
        food: { type: mongoose.Schema.ObjectId, ref: "Food", required: true },
        unit: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    orderDate: { type: Date },
    orderStatus: { type: String },
    remarks: { type: String },
    deliveryId: { type: String },
    readyTime: { type: Number },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const OrderModel = mongoose.model<OrderDoc>("Order", OrderSchema);
export { OrderModel as Order };
