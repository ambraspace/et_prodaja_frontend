export interface ProductFilter
{
    query?: string;
    searchComments?: boolean;
    warehouseId?: number;
    tags?: string[];
    categoryId?: number;
}