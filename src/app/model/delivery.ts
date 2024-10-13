import { Company } from "./company";
import { DeliveryItem } from "./delivery-item";
import { DeliveryStatus } from "./delivery-status";

export interface Delivery
{
    id: string;
    supplier: Company;
    supplierReference: string;
    comment: string;
    deliveryDate: Date;
    status: DeliveryStatus;
    deliveryItems: DeliveryItem[]
    value: number;
}