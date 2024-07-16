import { Delivery } from "./delivery";
import { Item } from "./item";

export interface DeliveryItem
{
    id: number;
    delivery: Delivery;
    item: Item;
    quantity: number;
    deliveryNote: string
}