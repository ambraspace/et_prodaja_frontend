import { Company } from "./company";
import { DeliveryStatus } from "./delivery-status";
import { Item } from "./item";

export interface Delivery
{
    id: number;
    supplier: Company;
    supplierReference: string;
    comment: string;
    deliveryDate: Date;
    status: DeliveryStatus;
    items: Item[];
    value: number;
}