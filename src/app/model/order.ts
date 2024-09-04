import { OrderStatus } from "./order-status";
import { Warehouse } from "./warehouse";

export interface Order
{
    id: number;
    warehouse: Warehouse;
    status: OrderStatus;
    creationDate: Date;
    closureTime: Date;
    value: number;
}