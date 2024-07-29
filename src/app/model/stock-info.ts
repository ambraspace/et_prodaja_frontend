import { Product } from "./product";
import { Warehouse } from "./warehouse";

export interface StockInfo
{
    id: number;
    warehouse: Warehouse;
    product: Product;
    customerReference: string;
    quantity: number;
    unitPrice: number;
}