<h1 align="center">
  <br>
  <img src="https://github.com/aboodmagdy1/Online-Food-Order-API/blob/main/images/online_food_order_app.png" alt="Food App image" width="200">
  <br>
  Online Food Order API

  <br>
</h1>

<h4 align="center">An awesome Food Order API built on top of <a href="https://nodejs.org/en/" target="_blank">NodeJS</a> , <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a>.</h4>

## Key Features 📝

* Authentication and Authorization
  - Signup , Login  with OTP , JWB

* Admin Dashboard
  - Get , Create Vendors

* Vendor Dashboard
  - Get , Add Foods
  - Update Service Availability

* Customer <h6>For Customers that will create account</h6>
  - Signup ,Login and Verification with OTP
  - Request OTP (resend OTP)
  - Get , Update Profile data 

* Shopping For Public Customer  :  <h6> based on pincode of area</h6> 
  -  Get  resturants for specific area that fooodservice is available
  -  Get top resturants  in specific area
  -  Get food that ready time will be less than 30 minutes in specific area
  -  Get get all availabel foods in this for specific area
  -  Get specific resturant  

* Greate Utility 
 - Password creation and validation
 - JWT signing and verifing 
 - Notification for otp 
      
    
* DTO Design Pattern

## Build With 🏗️

* [NodeJS](https://nodejs.org/en/) - JS runtime environment
* [Express](http://expressjs.com/) - The web framework used
* [TypeScript](https://www.typescriptlang.org/) - Programming Language
* [Mongoose](https://mongoosejs.com/) - Object Data Modelling (ODM) library
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database service
* [JSON Web Token](https://jwt.io/) - Security token
* [Stripe](https://stripe.com/) - Online payment API and Making payments on the app.
* [Postman](https://www.getpostman.com/) - API testing 
* [Twilio](https://www.twilio.com/en-us) - Fro SMS 







## Setting Up Your Local Environment ⚙️
![demo-env-file](https://github.com/aboodmagdy1/Online-Food-Order-API/blob/main/images/local-env.png)


## Installation 🛠️
You can fork the app or you can git-clone the app into your local machine. Once done, please install all the
dependencies by running
```
$ npm i
Set your env variables
$ npm run start:dev (for development)
$ npm run start:prod (for production)

