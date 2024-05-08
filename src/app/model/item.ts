import { Delivery } from "./delivery";
import { Offer } from "./offer";
import { StockInfo } from "./order";
import { Order } from "./stock-info";

export interface Item
{
    id: number;
    offer: Offer;
    order: Order;
    delivery: Delivery;
    deliveryNote: string;
    stockInfo: StockInfo;
    productName: string;
    quantity: number;
    grossPrice: number;
    discountPercent: number;
}