import { ProductFilter } from "./product-filter";

describe('ProductFilter', () => {

    it('should deserialize string', () => {

        let productFilter: ProductFilter = {
            query: "abc",
            searchComments: true,
            warehouseId: 42,
            tags: ["RED", "GREEN", "BLUE"],
            categoryId: 11
        } as ProductFilter;

        let filter = new ProductFilter(JSON.stringify(productFilter));

        expect(filter.query).toBe(productFilter.query);
        expect(filter.searchComments).toBe(productFilter.searchComments);
        expect(filter.warehouseId).toBe(productFilter.warehouseId);
        expect(filter.tags).toEqual(productFilter.tags);
        expect(filter.categoryId).toBe(productFilter.categoryId);

        productFilter = {
        } as ProductFilter;

        productFilter.tags = [];

        filter = new ProductFilter();

        expect(filter.query).toBe(productFilter.query);
        expect(filter.searchComments).toBe(productFilter.searchComments);
        expect(filter.warehouseId).toBe(productFilter.warehouseId);
        expect(filter.tags).toEqual(productFilter.tags);
        expect(filter.categoryId).toBe(productFilter.categoryId);

    });


    it('should test equals() method', () => {

        let productFilter: ProductFilter = {
            query: "abc",
            searchComments: true,
            warehouseId: 42,
            tags: ["RED", "GREEN", "BLUE"],
            categoryId: 11
        } as ProductFilter;

        let filter: ProductFilter = new ProductFilter(JSON.stringify(productFilter));

        expect(filter.equals(productFilter)).toBeTrue();

        productFilter = {
            query: "def",
            searchComments: true,
            warehouseId: 42,
            tags: ["RED", "GREEN", "BLUE"],
            categoryId: 11
        } as ProductFilter;

        expect(filter.equals(productFilter)).toBeFalse();

        productFilter = {
            query: "abc",
            searchComments: false,
            warehouseId: 42,
            tags: ["RED", "GREEN", "BLUE"],
            categoryId: 11
        } as ProductFilter;

        expect(filter.equals(productFilter)).toBeFalse();

        productFilter = {
            query: "abc",
            searchComments: true,
            warehouseId: 44,
            tags: ["RED", "GREEN", "BLUE"],
            categoryId: 11
        } as ProductFilter;

        expect(filter.equals(productFilter)).toBeFalse();

        productFilter = {
            query: "abc",
            searchComments: true,
            warehouseId: 42,
            tags: ["RED", "YELLOW", "BLUE"],
            categoryId: 11
        } as ProductFilter;

        expect(filter.equals(productFilter)).toBeFalse();

        productFilter = {
            query: "abc",
            searchComments: true,
            warehouseId: 42,
            tags: ["RED", "GREEN", "BLUE"],
            categoryId: 1
        } as ProductFilter;

        expect(filter.equals(productFilter)).toBeFalse();

    });


});