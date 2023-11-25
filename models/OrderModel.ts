import mongoose, { Schema, Model, Document } from "mongoose";

export interface OrderDoc extends Document {
    orderID: string ,
    items:[any], //[{food,unit}]
    totalAmount : number,
    orderDate : Date,
    paidThrough : string ,  // wallet , Credit Card , COD(cash on delivery)
    paymentResponse:string , // {status:true,response : bank responce}
    orderStatus: string
}


const OrderSchema = new Schema(
  {
    orderID: {type:String, required:true} ,
    items:[
        {
            food:{type:mongoose.Schema.ObjectId,ref:"Food",required : true},
            unit : {type: Number , required : true}
        }
    ], 
    totalAmount : {type:Number, required:true},
    orderDate : {type: Date},
    paidThrough : {type:String} ,  
    paymentResponse:{type:String} , 
    orderStatus:{type:String} , 
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
