export interface CreateVendorInput{
    name : string;
    ownerName : string;
    foodType: [string];
    pincode : string;
    address : string;
    phone : string;
    email : string;
    password : string;
    

}

export interface VendorLoginInputs{
    email: string;
    password: string;

}
export interface EditVendorInputs{
    name : string;
    address: string;
    phone :string;
    foodTypes : [string]

}


export interface VendorPayload {
    _id : string;
    name :string ;
    email: string;
    foodTypes : [string] ;

}


export interface CreateOfferInputs{
    offerType: string; 
    title: string;
    description: string; 
    minAmount: number; 
    offerAmount: number; 
    startValidity: Date;
    endvalidity: Date;
    promoCode: string; 
    promoType: string; 
    bank: [any]; 
    bins: [any]; 
    pincode: string; 
    isActice: string;
  
}