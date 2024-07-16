import { Category } from "./category";

export interface FlatTreeCategory
{
    expandable: boolean;
    name: string;
    level: number;
    category: Category;
}