
import express, { Application } from "express"; // this syntax is best for typescript projects (ES6)
import path from "path";
import bodyParser from "body-parser";
import morgan from "morgan"


import { VendorRoute, AdminRoute ,ShoppingRoute,CustomerRoute,DeliveryRoute} from "../routes";




export default async(app:Application)=>{

// middlewares
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true })); // this is for parsing form data
    const imgaesPath = path.join(__dirname,"../images")
    app.use(express.static(imgaesPath));
    
// // routes
    app.use(morgan('dev'))
    app.use("/admin", AdminRoute);
    app.use("/vendor", VendorRoute);
    app.use("/customer", CustomerRoute);
    app.use("/delivery", DeliveryRoute);

    app.use(ShoppingRoute)

    return app
}


 