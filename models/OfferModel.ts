import mongoose, { Schema, Model, Document } from "mongoose";

export interface OfferDoc extends Document {
  offerType: string; // Vendor or admin(generic)
  vendors: [any]; // vendors id because multiple vendors can be lindked to one offer
  title: string; // title of offer
  description: string; // description of offer
  minAmount: number; // minimum amount to get benefit from offer
  offerAmount: number; // this like discount value
  startValidity: Date;
  endvalidity: Date;
  promocode: string; // the code that customer will use to apply this offer
  promoType: string; // User , bank , card , all ( mean this offer will applied to one user or specific bank or card or all customers )
  bank: [any]; // the banks that the offer will applied to
  bins: [any]; // the cards that the offer will apply to
  pincode: string; // code of location for this offer
  isActice: string;
}

const OfferSchema = new Schema(
  {
    offerType: { type: String, required: true },
    vendors: [{ type: mongoose.Schema.ObjectId,ref:"Vendor"}],
    title: { type: String, required: true },
    description: { type: String },
    minAmount: { type: Number, required: true },
    offerAmount: { type: Number, required: true },
    startValidity: { type: Date},
    endtValidity: { type: Date },
    promocode: { type: String, required: true },
    promoType: { type: String, required: true },
    bank: [{ type: String}],
    bins: [{ type: Number }],
    pincode: { type: String, required: true },
    isActice: { type: Boolean},
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

const Offer = mongoose.model<OfferDoc>("Offer", OfferSchema);

export { Offer };
