import { OrderStatus } from "./order-status";
import { Warehouse } from "./warehouse";

export interface StockInfo
{
    id: number;
    warehouse: Warehouse;
    status: OrderStatus;
    closureTime: Date;
    value: number;
}