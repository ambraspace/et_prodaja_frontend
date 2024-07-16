import { Category } from "./category";
import { Preview } from "./preview";
import { Tag } from "./tag";

export interface Product
{
    id?: number;
    name: string;
    previews: Preview[];
    unit: string;
    price: number;
    purchasePrice?: number;
    availableQty?: number;
    offeredQty?: number;
    orderedQty?: number;
    category: Category;
    tags: Tag[];
    comment?: string;
}