export interface CreateVandorInput{
    name : string;
    ownerName : string;
    foodType: [string];
    pincode : string;
    address : string;
    phone : string;
    email : string;
    password : string;
    

}

export interface VandorLoginInputs{
    email: string;
    password: string;

}
export interface EditVandorInputs{
    name : string;
    address: string;
    phone :string;
    foodTypes : [string]

}


export interface VandorPayload {
    _id : string;
    name :string ;
    email: string;
    foodTypes : [string] ;

}
