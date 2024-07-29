import { DeliveryItem } from "./delivery-item";
import { Offer } from "./offer";
import { Order } from "./order";
import { StockInfo } from "./stock-info";

export interface Item
{
    id: number;
    offer: Offer;
    order: Order;
    deliveryItems: DeliveryItem[];
    stockInfo: StockInfo;
    productName: string;
    quantity: number;
    grossPrice: number;
    discountPercent: number;
    outstandingQuantity: number;
    netPrice: number;
}