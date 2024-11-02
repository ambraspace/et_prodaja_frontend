export class ProductFilter
{
    query?: string;
    searchComments?: boolean;
    warehouseId?: number;
    tags?: string[];
    categoryId?: number;

    constructor(pfs?: string)
    {
        if (pfs)
        {
            let pf = JSON.parse(pfs) as ProductFilter;
            this.query = pf.query;
            this.searchComments = pf.searchComments;
            this.warehouseId = pf.warehouseId;
            this.tags = pf.tags;
            this.categoryId = pf.categoryId;
        } else {
            this.tags = [];
        }
    }

    equals(pf: ProductFilter): boolean
    {
        
        if (this.query != pf.query) return false;

        if (this.query && this.query.trim() != '')
        {
            if (this.searchComments != pf.searchComments) return false
        }

        if (this.warehouseId != pf.warehouseId) return false;

        if (!this.arraysAreEqual(this.tags, pf.tags)) return false;

        if (this.categoryId != pf.categoryId) return false;

        return true;

    }

    private arraysAreEqual<T>(ar1?: T[], ar2?: T[]): boolean
    {
        
        if (ar1 == ar2) return true;

        if (ar1 != undefined && ar2 != undefined)
        {

            if (ar1.length != ar2.length) return false;

            for (let i = 0; i < ar1.length; i++)
            {
                let res = ar2.findIndex(a => a == ar1[i]);
                if (res == -1) return false;
            }

            return true;

        }

        return false;

    }

}