import { VendorPayload } from "./Vendor.dto";
import { CustomerPayload } from "./Customer.dto";
import { DeliveryPayload } from "./Delivery.dto";

export type AuthPayload = VendorPayload | CustomerPayload |DeliveryPayload
